import React from 'react';

function address(props) {
  return (
    <div className="tablet:px-[4rem] smphone:px-[2rem]">
      <div className="text-white border-double border-4 border-[#8D795B] p-2 text-center desktop:mb-[5rem] tablet:mb-[3rem] mb-[2rem] smphone:p-2 phone:p-1 ">
        <a
          target="_blank"
          href={'https://etherscan.io/address/' + props.address}
          className=" text-white font-light font-Inconsolata standard:text-[1.6rem] desktop:text-[1.4rem] laptop:text-[1.3rem] minilap:text-[1rem] tablet:text-[0.8rem] phone:text-[0.6rem] smphone:text-[0.5rem] phone:text-[0.4rem] font-light tracking-[3px] "
        >
          Address: {props.address}
        </a>
      </div>
    </div>
  );
}

export default address;
