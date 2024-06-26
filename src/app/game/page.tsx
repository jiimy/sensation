import { selectMusicStore } from '@/stores/selectMusic';
import { list } from '@vercel/blob';

// 게임화면
export default async function Page(context:any) {
  const response = await list();
  console.log('aa', context);

  function fetchMP3AndConvertToArrayBuffer(url: any) {
    console.log('컴파일 url', url);
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => arrayBuffer)
      .catch(error => {
        console.error('Error fetching MP3 file:', error);
      });
  }

  // fetchMP3AndConvertToArrayBuffer(response.blobs[2].url)
  //   .then(arrayBuffer => {
  //     console.log('MP3 file converted to ArrayBuffer:', arrayBuffer);
  //     // 여기서부터 arrayBuffer를 처리할 로직을 추가할 수 있습니다.
  //   });

  return (
    <>
      방번호
    </>
  );
}
