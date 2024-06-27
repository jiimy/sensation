'use client'
import React, { useEffect, useState } from 'react';

interface Note {
  time: number;
  value: number;
}

interface ClientComponentProps {
  base64String: string;
}

const Note = ({ base64String }: ClientComponentProps) => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [notes, setNotes] = useState([]) as any;
  // const arrayBuffer = base64ToUint8Array(data);
  // console.log('dd', arrayBuffer);

  useEffect(() => {
    if (base64String) {
      const arrayBuffer = base64ToArrayBuffer(base64String);
      decodeAudioData(arrayBuffer);
    }
  }, [base64String]);

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const decodeAudioData = (arrayBuffer: ArrayBuffer) => {
    const audioContext = new (window.AudioContext || window.AudioContext)();
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      setAudioBuffer(buffer);
      analyzeAudio(buffer);
    });
  };

  const analyzeAudio = (audioBuffer: AudioBuffer) => {
    const offlineContext = new OfflineAudioContext(
      1,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = offlineContext.createAnalyser();
    analyser.fftSize = 2048;

    source.connect(analyser);
    analyser.connect(offlineContext.destination);
    source.start(0);

    offlineContext.startRendering().then((renderedBuffer) => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(dataArray);

      const notes: Note[] = [];
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > 128) { // simplistic beat detection
          notes.push({
            time: i / audioBuffer.sampleRate,
            value: dataArray[i]
          });
        }
      }

      setNotes(notes);
    });
  };

  console.log('dd', notes);

  return (
    <div>
      노트 보여주기
      {/* <pre>{JSON.stringify(arrayBuffer)}</pre> */}
      <div className="notes">
        {notes.map((note:any, index:number) => (
          <div key={index} className="note" style={{ left: `${note.time * 100}%` }}>
            Note: {note.value}
          </div>
        ))}
      </div>
      <style jsx>{`
        .notes {
          position: relative;
          width: 100%;
          height: 100px;
          background: #000;
        }
        .note {
          position: absolute;
          top: 50%;
          width: 10px;
          height: 10px;
          background: red;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  );
};

export default Note;


function base64ToArrayBuffer(base64:any) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}