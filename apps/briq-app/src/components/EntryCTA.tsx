import { useStarknet, ConnectorNotFoundError } from '@starknet-react/core';
import { useState, useEffect } from 'react';
export const EntryCTA = () => {
  const { account, connect, connectors, error } = useStarknet();
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
          Get briqs & build
        </a>
      ) : (
        <div>
          <div>
            {!account && !error && (
              <button
                className="border px-4 py-2 rounded w-full bg-[#eb5600] hover:bg-[#c94a00]  font-body uppercase"
                onClick={() => {
                  connect(connectors[0]);
                }}
              >
                Connect to ArgentX
              </button>
            )}
            {error instanceof ConnectorNotFoundError && (
              <div className="p-4 text-red-800 bg-red-100 border-red-700 rounded-md">
                The ArgentX wallet extension could not be activated. Please{' '}
                <a
                  rel="noreferrer"
                  target="_blank"
                  className="underline"
                  href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                >
                  install ArgentX
                </a>{' '}
                on a supported browser and revisit this page.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
