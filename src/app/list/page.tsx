import List from '@/components/list/List';
import { list } from '@vercel/blob';

// 곡 목록 화면
export default async function Page() {
  const response = await list();

  return (
    <>
      <List data={response.blobs} />
    </>
  );
}