/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import { shortenAddress } from '@/util/formatters';
import { useWalletContext } from '../../hooks/useWalletContext';
export function DesiegeHeader() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();
  const starknet = useStarknet();
  return (
    <div>
      <div className="absolute z-20 hidden top-20 md:flex w-full">
        <div className="ml-auto px-8">
          <ul className="flex px-4 py-4 mr-auto space-x-4 text-xl rounded backdrop-blur-md  text-black">
            <li className="">
              {isConnected ? (
                <div className="flex space-x-2">
                  <span>
                    <a
                      className={
                        'cursor-pointer shadow-sm  font-body p-4  bg-white/70 rounded ml-auto py-2 flex'
                      }
                      onClick={disconnectWallet}
                    >
                      <span className="px-4 self-center">LORDS: {balance}</span>
                      <Ethereum className="w-4 mx-4" />
                      {displayName} [ disconnect ]{' '}
                    </a>
                  </span>
                </div>
              ) : (
                <button
                  className={
                    'cursor-pointer  shadow-sm font-body p-4  bg-white/20 rounded  ml-auto py-2'
                  }
                  onClick={connectWallet}
                >
                  Connect to Lootverse
                </button>
              )}
            </li>
            <li className="">
              {starknet?.account ? (
                <div className="flex">
                  <span>
                    <a
                      className={
                        'cursor-pointer  font-body p-4  bg-white/70 rounded ml-auto py-2 flex'
                      }
                      onClick={starknet.connectBrowserWallet}
                    >
                      <StarkNet className="w-5 mr-2" />
                      {shortenAddress(starknet?.account)}
                    </a>
                  </span>
                </div>
              ) : (
                <button
                  className={
                    'cursor-pointer  font-body p-4  bg-white/20 rounded  py-2'
                  }
                  onClick={starknet.connectBrowserWallet}
                >
                  Connect to StarkNet
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
