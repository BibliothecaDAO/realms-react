/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { Button } from '@bibliotheca-dao/ui-lib/base';
import React, { useEffect, useState } from 'react';

import { MainLayout } from '@/components/layout/MainLayout';

const DAOlordsBalance = 100000000;

function Treasury() {
  const [nftList, setNftList] = useState([]);
  const [erc20Balance, setErc20Balance] = useState<any>(); // for table array of obj
  const [lords, setLords] = useState<any>();

  function formatCurrency(value: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(value);
  }

  useEffect(() => {
    const getNftList = async () => {
      const response = await fetch('/api/getNFTList');
      const data = await response.json();
      // console.log(data); //logging nftlist data
      setNftList(data.data.realms);
    };

    const getERC20 = async () => {
      const response = await fetch('/api/getERC20Balances');
      const data = await response.json();
      setErc20Balance(data);
    };
    const getTokenInfo = async (token?: any) => {
      const response = await fetch(
        '/api/getTokenInfo?' + new URLSearchParams(token).toString()
      );
      const data = await response.json();
      setLords(data);
    };
    getNftList();
    getERC20();
    getTokenInfo({ token: '0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0' });
  }, []);

  return (
    <MainLayout>
      <div className="container px-10 py-20 pt-40 mx-auto sm:px-20 sm:py-40 sm:pt-60">
        <h1 className="mb-8 font-lords">Bibliotheca DAO</h1>
        <p className="sm:text-xl sm:w-1/2">
          {' '}
          The treasury funds managed by community members will be used to enable
          the DAO's mission, vision and goals.
        </p>
        <div className="flex mt-10">
          <Button
            href="https://snapshot.org/#/council.bibliotheca.eth"
            size="sm"
            variant="dao"
            texture={false}
          >
            Snapshot
          </Button>
        </div>
        {/* <FaqBlock faqs={treasuryPage} /> */}
      </div>
      <div className="border-t">
        <div className="container px-8 py-20 mx-auto">
          <h1 className="mb-10">Assets</h1>
          <table className="w-full mb-20 text-xs text-left border border-gray-300 table-auto sm:text-lg md:w-1/2 sm:w-2/3">
            <thead>
              <tr className="tracking-widest uppercase border border-off-300/40">
                <th className="p-2">Asset</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-right">USD</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-gray-300/40 ">
                <td className="p-2">Lords</td>
                <td className="p-2 text-right">{DAOlordsBalance}</td>
                <td className="p-2 text-right">
                  {lords && formatCurrency(DAOlordsBalance * lords.price.rate)}
                </td>
              </tr>
              {erc20Balance && (
                <tr className="border border-gray-300/40 ">
                  <td className="p-2">Ethereum</td>
                  <td className="p-2 text-right">
                    {erc20Balance.ETH.balance.toFixed(3)}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(
                      erc20Balance.ETH.balance * erc20Balance.ETH.price.rate
                    )}
                  </td>
                </tr>
              )}
              {erc20Balance?.tokens &&
                erc20Balance?.tokens.map((token: any) => (
                  <tr
                    key={token.tokenInfo.name}
                    className="border border-gray-300/40 "
                  >
                    <td className="p-2">{token.tokenInfo.name}</td>
                    <td className="p-2 text-right">
                      {(
                        token.balance / Math.pow(10, token.tokenInfo.decimals)
                      ).toFixed(3)}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        (token.balance /
                          Math.pow(10, token.tokenInfo.decimals)) *
                          token.tokenInfo.price.rate
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="container grid gap-4 sm:grid-cols-3 md:grid-cols-4">
            {nftList.map((realm: any) => (
              <div
                key={realm.tokenId}
                className="rounded rounded-t shadow-lg bg-gray-900/40"
              >
                <img
                  className="object-cover w-full rounded-t"
                  src={
                    `https://d23fdhqc1jb9no.cloudfront.net/_Realms/` +
                    realm.tokenId +
                    `.svg`
                  }
                  alt=""
                />
                <div className="p-4">
                  <h5 className="text-off-300">Realm #{realm.tokenId}</h5>
                  <h4 className="text-off-300">{realm.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Treasury;
