import Link from "next/link";

export default function Home() {
  return (
    <main>
      <ul>
        <li>
          <Link href={'/list'}>시작</Link>
        </li>
        <li>
          <Link href={'/login'}>로그인</Link>
          <Link href={'/regist'}>회원가입</Link>
        </li>
        <li>
          <Link href={'/setting'}>설정</Link>
        </li>
      </ul>
    </main>
  );
}
