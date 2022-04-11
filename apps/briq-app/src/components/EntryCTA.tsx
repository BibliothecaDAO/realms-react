import { useStarknet } from '@starknet-react/core';
import { useState, useEffect } from 'react';
export const EntryCTA = () => {
  const {
    account,
    connectBrowserWallet,
    error: starknetConnectionError,
    hasStarknet,
  } = useStarknet();
  const [options, setOptions] = useState<any>([]);

  return (
    <div className="pt-8 pb-16">
      {account ? (
        <a
          target={'_blank'}
          href={`https://docs.google.com/forms/d/e/1FAIpQLSc66txDM8Ei3w83p3kLJL30VoBS6P7Xep4cIDVACZAbLY05mg/viewform?usp=pp_url&entry.2005620554=${account}`}
          className="border px-4 py-2 rounded w-full bg-[#eb5600] hover:bg-[#c94a00] font-body uppercase"
          rel="noreferrer"
        >
          Get briqs & buidl
        </a>
      ) : (
        <div>
          <div>
            {hasStarknet ? (
              <div>
                If you haven't already done so, please{' '}
                <a
                  rel="noreferrer"
                  target="_blank"
                  className="underline"
                  href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                >
                  download and install{' '}
                </a>
                the ArgentX extension, available now for the Google Chrome web
                browser.
              </div>
            ) : (
              <div className="p-4 bg-red-100/30 border-red-700 rounded-md mb-2 text-white">
                The ArgentX wallet extension could not be activated. Please{' '}
                <a
                  rel="noreferrer"
                  target="_blank"
                  className="underline"
                  href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                >
                  install ArgentX{' '}
                </a>
                on a supported browser and revisit this page.
              </div>
            )}
          </div>
          <button
            className="border px-4 py-2 rounded w-full bg-[#eb5600] hover:bg-[#c94a00]  font-body uppercase"
            onClick={() => connectBrowserWallet()}
          >
            Connect to ArgentX
          </button>
        </div>
      )}
    </div>
  );
};
