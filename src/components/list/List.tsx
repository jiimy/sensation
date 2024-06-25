'use client'
import React from 'react';
// import { redirect } from 'next/navigation';

// TODO: 타입 any인것들 바꿔주기
type listtype = {
  // data: blob[];
  data?: any;
}

const List = ({ data }: listtype) => {
  console.log('data: ', data)

  const selectMusic = (index: any) => {
    console.log('클릭');
  };


  return (
    <ul>
      {data.map((item: any, index: number) => (
        <li key={index} >
          <div onClick={() => selectMusic(index)}>
            곡번호: {`${index + 1}`}
            {item.pathname}
          </div>
          <div>속도 선택 1 2 3 </div>
          <div>키 모드 4키 6키  </div>
        </li>
      ))}
    </ul>
  );
};

export default List;