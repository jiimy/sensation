import { list } from '@vercel/blob';

export default async function Page() {
  const response = await list();

  console.log('res', response);

  return (
    <>
      {response.blobs.map((blob) => (
        <a key={blob.pathname} href={blob.downloadUrl}>
          {blob.pathname}
        </a>
      ))}
    </>
  );
}