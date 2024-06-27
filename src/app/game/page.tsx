import Note from '@/components/note/Note';
import { selectMusicStore } from '@/stores/selectMusic';
import { base64ArrayBuffer } from '@/util/base64';
import { list } from '@vercel/blob';

// 게임화면
export default async function Page(params:any) {
  const response = await list();
  const musicIndex = params.searchParams.music;
  const url = response.blobs[musicIndex]?.url;

  const arrayBuffer = await fetchMP3AndConvertToArrayBuffer(url);
  const base64String = base64ArrayBuffer(arrayBuffer);

  // console.log('dd : ', arrayBuffer);

  return (
    <>
      <h1>방번호</h1>
      {/* <ClientComponent arrayBuffer={arrayBuffer} /> */}
      <Note base64String={base64String} />
      {/* <Note data={arrayBuffer} /> */}
    </>
  );
}

async function fetchMP3AndConvertToArrayBuffer(url:any) {
  if (!url) {
    throw new Error('Invalid URL');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.arrayBuffer();
}
