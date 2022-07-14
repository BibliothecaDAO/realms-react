/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import NftListClick from './NftListClick';

function Nft_list(props) {
  return (
    <div
      onClick={() => {
        NftListClick(props.content);
      }}
      className="flex justify-between items-center  pl-[.5rem] pr-[.8rem] py-[.3rem] hover:bg-[#202023]"
    >
      <p className="font-Inconsolata text-lg tracking-[2px] truncate w-[75%] hover:cursor-pointer">
        {props.content}
      </p>
      <p className="text-lg font-Inconsolata">{props.number}</p>
    </div>
  );
}

export default Nft_list;
