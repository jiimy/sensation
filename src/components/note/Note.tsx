'use client'
import React, { useEffect, useState, useCallback } from 'react';

interface Note {
  time: number; // 노트가 나타날 시간 (초)
  lane: number; // 노트가 위치할 레인 (0~3)
  value: number; // 노트의 강도
}

interface ClientComponentProps {
  audioUrl: string;
}

const Note = ({ audioUrl }: ClientComponentProps) => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const analyzeAudioForRhythmGame = useCallback(async (audioBuffer: AudioBuffer) => {
    console.log('🎵 오디오 분석 시작...');
    
    try {
      const channelData = audioBuffer.getChannelData(0); // 첫 번째 채널 사용
      const sampleRate = audioBuffer.sampleRate;
      const samplesPerNote = Math.floor(sampleRate * 0.5); // 0.5초마다 샘플링 (더 적은 노트)
      
      const detectedNotes: Note[] = [];
      const beatThreshold = 0.2; // 비트 감지 임계값 (낮춤)
      const minInterval = 0.3; // 최소 노트 간격 (초)
      
      let lastNoteTime = -minInterval;
      
      console.log(`총 샘플 수: ${channelData.length}, 샘플레이트: ${sampleRate}`);
      
      // 오디오를 구간별로 나누어 분석
      for (let i = 0; i < channelData.length; i += samplesPerNote) {
        const sampleWindow = channelData.slice(i, Math.min(i + samplesPerNote, channelData.length));
        
        // RMS(Root Mean Square) 계산 - 음량 측정
        const rms = Math.sqrt(
          sampleWindow.reduce((sum, sample) => sum + sample * sample, 0) / sampleWindow.length
        );

        // 에너지가 임계값 이상이고 최소 간격을 유지하는 경우 노트 생성
        const currentTime = i / sampleRate;
        if (rms > beatThreshold && currentTime - lastNoteTime >= minInterval) {
          // 4개의 레인 중 하나에 무작위 배치
          const lane = Math.floor(Math.random() * 4);
          
          detectedNotes.push({
            time: currentTime,
            lane: lane,
            value: rms
          });
          
          lastNoteTime = currentTime;
        }
      }

      setNotes(detectedNotes);
      console.log(`✅ ${detectedNotes.length}개의 노트가 생성되었습니다.`);
    } catch (err) {
      console.error('❌ 오디오 분석 실패:', err);
      setError(`오디오 분석 실패: ${err}`);
    }
  }, []);

  const loadAndDecodeAudio = useCallback(async (url: string) => {
    console.log('🎵 오디오 URL 받음:', url);
    setLoading(true);
    setError('');
    
    try {
      // 1. URL에서 오디오 파일 다운로드
      console.log('📥 오디오 파일 다운로드 시작...');
      const response = await fetch(url);
      console.log('📥 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`파일 다운로드 실패: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log('📄 Content-Type:', contentType);
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('✅ 다운로드 완료, 크기:', arrayBuffer.byteLength, 'bytes');
      
      // 2. 오디오 디코딩
      console.log('🔊 오디오 디코딩 시작...');
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log('✅ 오디오 디코딩 성공!');
      console.log('  - 길이:', buffer.duration, '초');
      console.log('  - 샘플레이트:', buffer.sampleRate, 'Hz');
      console.log('  - 채널 수:', buffer.numberOfChannels);
      console.log('  - 총 샘플 수:', buffer.length);
      
      setAudioBuffer(buffer);
      setDuration(buffer.duration);
      
      // 3. 리듬게임 노트 분석
      await analyzeAudioForRhythmGame(buffer);
      
      setLoading(false);
    } catch (error: any) {
      console.error('❌ 오류 발생:', error);
      setError(`오류: ${error.message || '알 수 없는 오류'}`);
      setLoading(false);
    }
  }, [analyzeAudioForRhythmGame]);

  useEffect(() => {
    if (audioUrl) {
      loadAndDecodeAudio(audioUrl);
    }
  }, [audioUrl, loadAndDecodeAudio]);


  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>오디오를 로딩하는 중...</p>
          <p className="subtext">console을 확인하세요</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>❌ 오류 발생</h2>
          <p>{error}</p>
          <details>
            <summary>디버그 정보</summary>
            <pre>오디오 URL: {audioUrl}</pre>
            <pre>Console 로그를 확인하세요</pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="info">
        <h2>리듬 게임 노트 미리보기</h2>
        <p>총 {notes.length}개의 노트 | 음악 길이: {duration.toFixed(2)}초</p>
      </div>
      
      {/* 4개 레인을 표시 */}
      <div className="lanes">
        {[0, 1, 2, 3].map((lane) => (
          <div key={lane} className="lane">
            <div className="lane-label">레인 {lane + 1}</div>
            <div className="lane-track">
              {notes
                .filter((note) => note.lane === lane)
                .map((note, index) => (
                  <div
                    key={index}
                    className="note"
                    style={{
                      left: `${(note.time / duration) * 100}%`,
                      opacity: Math.min(note.value * 2, 1)
                    }}
                    title={`시간: ${note.time.toFixed(2)}초, 강도: ${note.value.toFixed(2)}`}
                  >
                    <div className="note-bar" style={{ height: `${Math.min(note.value * 200, 30)}px` }} />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          color: #fff;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #333;
          border-top: 4px solid #ff6b6b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .subtext {
          font-size: 14px;
          color: #888;
        }

        .error h2 {
          color: #ff6b6b;
          margin-bottom: 15px;
        }

        .error details {
          margin-top: 20px;
          text-align: left;
        }

        .error pre {
          background: #1a1a1a;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }

        .info {
          text-align: center;
          margin-bottom: 30px;
        }

        .info h2 {
          color: #fff;
          margin-bottom: 10px;
        }

        .info p {
          color: #aaa;
        }

        .lanes {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .lane {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 10px;
        }

        .lane-label {
          color: #fff;
          font-weight: bold;
          margin-bottom: 10px;
          padding: 5px;
        }

        .lane-track {
          position: relative;
          height: 40px;
          background: #0a0a0a;
          border-radius: 4px;
          overflow: visible;
        }

        .note {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .note-bar {
          width: 8px;
          background: linear-gradient(to top, #ff6b6b, #ffa500);
          border-radius: 4px;
          box-shadow: 0 0 8px rgba(255, 107, 107, 0.5);
          transition: opacity 0.2s;
        }

        .note:hover .note-bar {
          box-shadow: 0 0 12px rgba(255, 107, 107, 0.8);
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default Note;