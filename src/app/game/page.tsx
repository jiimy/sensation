import Note from '@/components/note/Note';
import { list } from '@vercel/blob';

// 게임화면
export default async function Page({ searchParams }: { searchParams: { music?: string } }) {
  const response = await list();
  // const musicIndex = Number(searchParams?.music ?? -1);
  const musicIndex = 6;
  const url = Number.isFinite(musicIndex) && musicIndex >= 0 ? response.blobs[musicIndex]?.url : undefined;

  console.log('📍 Blob URL:', url);
  console.log('📍 Blob 개수:', response.blobs.length);

  if (!url) {
    return (
      <>
        <h1>방번호</h1>
        <div style={{ padding: '20px', color: '#fff' }}>
          <h2>❌ 음악 파일을 찾을 수 없습니다</h2>
          <p>Blob 개수: {response.blobs.length}</p>
          <p>음악 인덱스: {musicIndex}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>방번호</h1>
      <Note audioUrl={url} />
    </>
  );
}
