/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import Address from '@/components/treasury/address';
import Nft_img from '@/components/treasury/Nft_img';
import Nft_list from '@/components/treasury/Nft_list';
import Tablehead from '@/components/treasury/Table';
import TableRow from '@/components/treasury/TableRow';
import TotalAssets from '@/components/treasury/TotalAssets';

const walletaddress = '0xef3155450bAA054ffE7950509CE2042613EE6586';

function Treasury() {
  const [nfts, setnfts] = useState([]); // for nft img array of obj
  const [nftlist, setnftlist] = useState([]);
  const [table, settable] = useState([]); // for table array of obj
  const [totalassest, settotalassest] = useState();

  const [filtertab, setfiltertab] = useState(true);

  function changefiltertab() {
    setfiltertab(!filtertab);
  }

  // useEffect(() => {
  //   const getnft = async () => {
  //     const response = await fetch('/api/getNFTs');
  //     const data = await response.json();
  //     // console.log(data); //logging nfts data
  //     setnfts(data);
  //   };

  //   const getnftlist = async () => {
  //     const response = await fetch('/api/getNFTList');
  //     const data = await response.json();
  //     // console.log(data); //logging nftlist data
  //     setnftlist(data);
  //   };

  //   const gettable = async () => {
  //     const response = await fetch('/api/tableApi');
  //     const data = await response.json();
  //     // console.log(data); //logging table data
  //     settable(data);
  //   };

  //   const gettotalassest = async () => {
  //     const response = await fetch('/api/totalAsset');
  //     const data = await response.json();
  //     // console.log(data);
  //     settotalassest(data);
  //   };

  //   gettable();
  //   getnft();
  //   getnftlist();
  //   gettotalassest();
  // }, []);

  return (
    <MainLayout>
      <div className="container px-10 py-40 mx-auto pt-60">
        <h1>Bibliotheca DAO</h1>
        <p>
          {' '}
          The treasury funds managed by community members will be used to enable
          the DAO's mission, vision and goals.
        </p>
      </div>
      <div className="bg-off-300">
        <div className="container px-10 py-40 mx-auto text-gray-900">
          <h1 className="mb-10">Assets</h1>

          <h3>Coins</h3>
          <table className="w-full mb-20 text-left border border-gray-900 table-auto sm:w-1/2">
            <thead>
              <tr className="tracking-widest uppercase border border-gray-900">
                <th className="p-2">Asset</th>
                <th className="p-2">Amount</th>
                <th className="p-2">USD</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-gray-900 ">
                <td className="p-2">Ethereum</td>
                <td>290</td>
                <td>1961</td>
              </tr>
            </tbody>
          </table>

          <h3>NFTs</h3>
          <div className="container grid gap-4 sm:grid-cols-3 md:grid-cols-4">
            <div className="bg-gray-900 rounded rounded-t shadow-lg">
              <img
                className="object-cover w-full rounded-t"
                src="https://d23fdhqc1jb9no.cloudfront.net/_Realms/2.svg"
                alt=""
              />
              <div className="p-4">
                <h4 className="text-off-300">Realm</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 

      <div className="tablet:px-[4rem] smphone:px-[2rem] font-Inconsolata flex items-center justify-between mb-[6rem] tablet:flex-col-reverse laptop:flex-row phone:flex-col-reverse smphone:flex-col-reverse desktop:px-[5rem]">
        <div className="text-white font-light laptop:w-[62%] tablet:w-[100%] tracking-[2px] standard:text-[1.5rem] desktop:text-[1.4rem] desktop:text-[1.3rem] minilap:text-[1rem] tablet:text-[1.2rem] phone:text-[1rem] smphone:text-[0.8rem] phone:mt-[1rem] smphone:mt-[2rem]">
          The treasury funds managed by community members will be used to enable
          the DAO's mission, vision and goals.
          <p className="text-[#8D795B] my-[1rem] text-[2.3rem] phone:text-[1.8rem] smphone:text-[1.3rem]">
            Principles :
          </p>
          <ul className="list-disc pl-[3rem]">
            <li>clarity on allocation and distribution of funds</li>
            <li>robust counsel on key risk mitigation of community wallet</li>
            <li>real-time dashboard of state of the treasury</li>
          </ul>
        </div>
        <img
          className="phone:p-2 standard:w-[25rem] standard:h-[25rem] desktop:w-[23rem] desktop:h-[23rem] laptopo:w-[21rem] laptop:h-[21rem] minilap:w-[18rem] minilap:h-[18rem] tablet:w-[15rem] tablet:h-[15rem] phone:w-[15rem] phone:h-[15rem] smphone:w-[13rem] smphone:h-[13rem] "
          src="./bibliotheca-logo.jpg"
          alt="treasury"
        />
      </div>

      <Address address={walletaddress} />

      <div className="tablet:px-[4rem] smphone:px-[2rem]">
        <div className="border-double border-4 border-[#8D795B] py-[2rem]">
          <TotalAssets total={totalassest} />
          <div className="tablescroll max-h-[30rem] overflow-auto overflow-x-scroll scrolling max-w-full">
            <Tablehead></Tablehead>
            {table.map((TableRowData: any, index) => (
              <TableRow
                key={TableRowData.name}
                id={index + 1}
                token={TableRowData.name}
                usdValue={TableRowData.inUsd}
                percentage={TableRowData.percent}
                tokenValue={TableRowData.balance}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="py-[4rem] tablet:px-[4rem] smphone:px-[2rem] text-white mb-[4rem]">
        <h1 className="font-EB_Garamond tracking-[2px] smphone:mb-[1rem] smphone:text-[1.3rem] laptop:mb-[1rem] laptop:text-[1.5rem] standard:mb-[2rem] standard:text-[2rem]">
          NFT Assets
        </h1>
        <div className="border-double border-4 border-[#8D795B] standard:h-[80vh] desktop:h-[70vh] laptop:h-[60vh] tablet:h-[50vh] grid laptop:grid-cols-[.60fr,2fr]">
          <div className="h-full border-solid border-r-2 border-[#8D795B] overflow-auto nft_asset smphone:hidden laptop:inline-block">
            <div className="py-[2.5rem] px-[1.5rem]">
              <div className="flex justify-between items-center mb-[.1rem] hover:bg-[#202023] px-[.5rem] py-[.3rem] hover:cursor-pointer">
                <p className="text-lg font-Inconsolata">All</p>
                <img src="./arrow-right.png" alt="icon" className="w-6 h-6" />
              </div>

              {nftlist.map((asset: any) => (
                <Nft_list
                  key={asset.name}
                  content={asset.name}
                  number={asset.count}
                />
              ))}
            </div>
          </div>

          <div
            className={
              'h-full border-solid border-2 border-[#8D795B] overflow-auto nft_asset fixed top-0 left-0 bg-[#161619] minilap:w-[45%] ' +
              (filtertab ? 'hidden' : 'inline-block')
            }
          >
            <div className="p-[1.5rem]">
              <div className="flex justify-end px-[.5rem] py-[.3rem] mb-[1rem]">
                <div role="button" onClick={() => changefiltertab}>
                  <img
                    alt="Close"
                    className="w-[1.5rem] cursor-pointer"
                    src="./Close-444.png"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-[.1rem] hover:bg-[#202023] px-[.5rem] py-[.3rem] hover:cursor-pointer">
                <p className="text-lg font-Inconsolata">All</p>
                <img src="./arrow-right.png" alt="icon" className="w-6 h-6" />
              </div>

              {nftlist.map((asset: any) => (
                <Nft_list
                  key={asset.name + 'phone'}
                  content={asset.name}
                  number={asset.count}
                />
              ))}
            </div>
          </div>

          <div className="border-solid border-b-[.5px] border-[#8D795B] bg-[#161619] px-[1rem] py-[1.5rem] laptop:hidden">
            <button
              className="font-EB_Garamond px-[1.5rem] py-[.6rem] rounded-full border-solid border-[1px] border-[#8D795B]"
              onClick={changefiltertab}
            >
              Open Filter+
            </button>
          </div>

          <div className="h-full p-[2rem] nft_asset_imgs sm:flex flex-wrap justify-center laptop:grid grid-cols-4 overflow-y-scroll gap-[2rem]">
            {nfts.map((nft: any) => (
              <Nft_img key={nft.tokenid} url={nft.imgurl} name={nft.nftname} />
            ))}
          </div>
        </div>
      </div> */}
    </MainLayout>
  );
}

export default Treasury;
