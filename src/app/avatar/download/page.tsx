import List from '@/components/list/List';
import { list } from '@vercel/blob';

export default async function Page() {
  const response = await list();

  // console.log('res', response.blobs[2]);
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
      <List data={response.blobs} />
      {response.blobs.map((blob) => (
        <>
          {blob.pathname}
        </>
      ))}
    </>
  );
}