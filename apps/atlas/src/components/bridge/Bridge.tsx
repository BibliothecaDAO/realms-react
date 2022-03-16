import { XCircleIcon, CheckIcon as Check } from '@heroicons/react/solid';
import {
  useStarknet,
  useStarknetTransactionManager,
} from '@starknet-react/core';
import axios from 'axios';

import classNames from 'classnames';
import { useState, useEffect, useMemo } from 'react';
import type { AddTransactionResponse } from 'starknet';
import useGameStats from '@/hooks/useGameStats';
import useTxCallback from '@/hooks/useTxCallback';
import { useWalletContext } from '@/hooks/useWalletContext';
import Button from '@/shared/Button';
import ElementsLabel from '@/shared/ElementsLabel';
import { ExternalLink } from '@/shared/Icons';
import { messageKey } from '@/util/messageKey';
import { getLatestGameIndex } from '@/util/minigameApi';
import MintRequirements from './MintRequirements';

import type { MintingError } from '@/../pages/api/minigame_alpha_mint';

type Prop = {
  initialTab?: TabName;
  onComplete?: () => void;
  onClose: () => void;
  towerDefenceStorageContractAddress: string;
};

type TabName =
  | 'connect-ethereum'
  | 'mint-requirements'
  | 'connect-starknet'
  | 'mint';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const Bridge: React.FC<Prop> = (props) => {
  const starknet = useStarknet();
  const txManager = useStarknetTransactionManager();
  const { account, signer, connectWallet, isConnected } = useWalletContext();

  const [gameIdx, setGameIdx] = useState<string>();
  const [mintError, setMintError] = useState<string>();
  const [middlewareStatus, setMiddlewareStatus] = useState<
    'signing' | 'pending' | 'completed'
  >();

  const [transactionHash, setTransactionHash] = useState<string>();

  useEffect(() => {
    if (transactionHash) {
      // The transaction was executed on a middleware
      // designed to balance and control game minting
      // Need to manually track transaction here
      txManager.addTransaction({
        transactionHash,
        address: starknet.account as string,
        status: 'TRANSACTION_RECEIVED',
      });
    }
  }, [transactionHash]);

  useEffect(() => {
    getLatestGameIndex()
      .then((val: any) => setGameIdx(val))
      .catch((e: any) => {
        // TODO: Handle error
        console.error(e);
      });
  }, []);

  /* if (error instanceof UserRejectedRequestError) {
    console.log("TODO: Handle user rejection");
  } */

  const [side, setSide] = useState<'light' | 'dark'>();

  /* const [unsupportedChain, setUnsupportedChain] = useState(chainId !== 1); // 1 is Ethereum Mainnet

  useEffect(() => {
    setUnsupportedChain(error instanceof UnsupportedChainIdError);
  }, [error]); */

  const [currentTab, setCurrentTab] = useState<TabName>(
    props.initialTab || 'mint'
  );

  useEffect(() => {
    if (!isConnected) {
      setCurrentTab('connect-ethereum');
    } else {
      if (starknet.account) {
        setCurrentTab('mint');
      } else {
        setCurrentTab('connect-starknet');
      }
    }
  }, [isConnected, starknet.account]);

  // Add +1 to show for next round
  const nextGameIdx = useMemo(() => parseInt(gameIdx as string) + 1, [gameIdx]);
  const totalMinted = useGameStats(
    nextGameIdx,
    props.towerDefenceStorageContractAddress
  );

  const verifyAndMint = async () => {
    try {
      setMintError(undefined);
      if (signer) {
        setMiddlewareStatus('signing');
        const sig = await signer.signMessage(
          messageKey(starknet.account as string)
        );
        setMiddlewareStatus('pending');
        const res = await axios.post<AddTransactionResponse | MintingError>(
          '/api/minigame_alpha_mint',
          {
            starknetAddress: starknet.account,
            sig,
            chosenSide: side,
            gameIdx,
          }
        );

        if ('code' in res.data && res.data.code == 'TRANSACTION_RECEIVED') {
          setTransactionHash(res.data.transaction_hash);
          setMintError(undefined);
        }
        if ('error' in res.data) {
          setMintError(res.data.error);
        }
      }
    } catch (e: any) {
      setMintError(e.message);
    } finally {
      setMiddlewareStatus(undefined);
    }
  };

  const tabBtnClasses = {
    base: 'px-4 py-2 my-2 flex-grow mx-2 text-gray-800 rounded-sm hover:bg-gray-100 hover:text-gray-800',
    active: 'text-white bg-gray-300',
  };

  const connectedClassname =
    'inline-block py-2 break-words px-4 bg-white/30 rounded-md';

  const txTracker = useTxCallback(transactionHash, (status) => {
    if (status !== 'REJECTED') {
      props.onComplete && props.onComplete();
    }
  });

  const mintTxLoading = txTracker.loading;

  const Checkmark = <Check className="inline-block w-6 ml-1" />;

  useEffect(() => {
    starknet.connectBrowserWallet();
  }, []);
  return (
    <div className="w-full pt-4 sm:w-1/2">
      <div className="p-4 mx-2 mt-4 rounded-lg bg-white/60">
        <h1 className="flex flex-row items-start justify-between px-2 mt-4 mb-4">
          <ElementsLabel className="h-20">Desiege Setup</ElementsLabel>

          <button onClick={() => props.onClose()} className="text-black">
            <XCircleIcon className="h-8" />
          </button>
        </h1>
        <div className="px-2 text-gray-800">
          <nav className="flex flex-row rounded-md bg-white/70">
            <button
              onClick={() => setCurrentTab('connect-ethereum')}
              className={classNames(
                tabBtnClasses.base,
                currentTab == 'connect-ethereum' ? tabBtnClasses.active : null
              )}
            >
              <span className="flex">
                1. Connect Ethereum
                {account ? Checkmark : null}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('mint-requirements')}
              className={classNames(
                tabBtnClasses.base,
                currentTab == 'mint-requirements' ? tabBtnClasses.active : null
              )}
            >
              <span className="flex">2. Lords Balance</span>
            </button>

            <button
              onClick={() => setCurrentTab('connect-starknet')}
              className={classNames(
                tabBtnClasses.base,
                currentTab == 'connect-starknet' ? tabBtnClasses.active : null
              )}
            >
              <span className="flex">
                3. Connect StarkNet
                {account ? Checkmark : null}
              </span>
            </button>
            <button
              onClick={() => setCurrentTab('mint')}
              className={classNames(
                tabBtnClasses.base,
                currentTab == 'mint' ? tabBtnClasses.active : null
              )}
            >
              <span className="flex">
                4. Mint <ElementsLabel className="ml-1">ELEMENTS</ElementsLabel>
              </span>
            </button>
          </nav>
          <div className="text-xl">
            {currentTab == 'connect-ethereum' ? (
              <div className="py-4">
                {account ? (
                  <p className={connectedClassname}>Connected as {account}</p>
                ) : (
                  <Button
                    className="mt-4 mr-2 text-black"
                    onClick={connectWallet}
                  >
                    Connect to Lootverse
                  </Button>
                )}
                {/* TODO
                {unsupportedChain ? (
                  <p className="mt-2">
                    Wrong Network. Please switch to Ethereum mainnet.
                  </p>
                ) : null} */}
              </div>
            ) : null}
            {currentTab == 'mint-requirements' ? (
              <div className="py-4">
                <MintRequirements l1Address={account.toString()} />
              </div>
            ) : null}
            {currentTab == 'connect-starknet' ? (
              <div className="py-4">
                {starknet.account ? (
                  <p className={connectedClassname}>
                    Connected as {starknet.account}
                  </p>
                ) : (
                  <div>
                    <div className="text-2xl">
                      {starknet.hasStarknet ? (
                        <div>
                          If you haven&apos;t already done so, please{' '}
                          <a
                            rel="noreferrer"
                            target="_blank"
                            className="underline"
                            href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                          >
                            download and install
                          </a>{' '}
                          the ArgentX extension, available now for the Google
                          Chrome web browser.
                        </div>
                      ) : (
                        <div className="p-4 text-red-800 bg-red-100 border-red-700 rounded-md">
                          The ArgentX wallet extension could not be activated.
                          Please{' '}
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
                    <Button
                      onClick={() => starknet.connectBrowserWallet()}
                      className="mt-4"
                    >
                      Connect to ArgentX
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
            {currentTab === 'mint' ? (
              <div className="py-4">
                {starknet.account ? (
                  <>
                    <h1 className="my-8 text-4xl">Pick your Allegiance</h1>
                    <div className="flex w-full space-x-2 ">
                      <div className="relative w-full text-center group">
                        <div
                          className={classNames(
                            'w-full p-1 text-white transition duration-300 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 group-hover:opacity-100 group-hover:duration-200 animate-tilt',
                            side == 'light' ? 'opacity-100' : 'opacity-50'
                          )}
                        >
                          <button
                            onClick={() => setSide('light')}
                            className="relative items-center w-full py-4 leading-none tracking-widest text-pink-400 uppercase bg-white divide-x divide-gray-600 rounded-md px-7"
                          >
                            <span className="flex justify-center">
                              {' '}
                              Light{' '}
                              {/* {side == "light" ? (
                                <Check className="h-4 ml-1" />
                              ) : null} */}
                            </span>
                          </button>
                        </div>
                        {totalMinted.light
                          ? totalMinted.light +
                            ' total distilled for next round'
                          : '-'}
                      </div>
                      <div className="relative w-full text-center group">
                        <div
                          className={classNames(
                            'w-full p-1 text-white transition duration-300 rounded-lg bg-gradient-to-r from-red-600 to-blue-600 group-hover:opacity-100 group-hover:duration-200 animate-tilt',
                            side == 'dark' ? 'opacity-100' : 'opacity-50'
                          )}
                        >
                          <button
                            onClick={() => setSide('dark')}
                            className="relative flex items-center justify-center w-full py-4 leading-none tracking-widest text-center text-white uppercase bg-black divide-x divide-gray-600 rounded-md px-7"
                          >
                            Dark{' '}
                            {/* {side == "dark" ? <Check className="ml-1" /> : null} */}
                          </button>
                        </div>
                        {totalMinted.dark
                          ? totalMinted.dark + ' total distilled for next round'
                          : '-'}
                      </div>
                    </div>

                    {txTracker.tx?.status == 'ACCEPTED_ON_L2' ? (
                      <p className="mt-4 text-2xl text-green-800">
                        Element distillation ceremony completed.
                      </p>
                    ) : null}
                    {transactionHash ? (
                      <a
                        // TODO: Choose host dynamically here based on network
                        href={`https://goerli.voyager.online/tx/${transactionHash}/`}
                        className="underline"
                        target={'_blank'}
                        rel="noopener noreferrer"
                      >
                        Check Transaction Status{' '}
                        <ExternalLink className="inline-block h-6" />
                      </a>
                    ) : null}
                    {mintTxLoading ? (
                      <>
                        <p className="mt-8 text-2xl animate-bounce">
                          Minting...
                        </p>
                        <p>
                          Please wait, StarkNet is still in alpha. Your
                          transaction is being executed on the sequencer.
                        </p>
                      </>
                    ) : (
                      <>
                        {side !== undefined && transactionHash == undefined ? (
                          <>
                            <p className="mt-8 text-2xl break-words">
                              {messageKey('')}
                            </p>
                            <p className={connectedClassname}>
                              {starknet.account}
                            </p>

                            <Button
                              className="mt-4"
                              onClick={() => verifyAndMint()}
                            >
                              Sign and Mint
                            </Button>
                            {middlewareStatus == 'signing' ||
                            middlewareStatus == 'pending' ? (
                              <p className="mt-4 text-2xl animate-bounce">
                                {middlewareStatus == 'signing'
                                  ? 'Requesting signature...'
                                  : ''}
                                {middlewareStatus == 'pending'
                                  ? 'Starting Element distillation...'
                                  : ''}
                              </p>
                            ) : null}
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                ) : (
                  <p>
                    No Starknet account connected.{' '}
                    <Button onClick={() => setCurrentTab('connect-starknet')}>
                      Connect StarkNet
                    </Button>
                  </p>
                )}
                {mintError !== undefined ||
                txTracker.tx?.status == 'REJECTED' ? (
                  <p className="mt-4 text-xl text-red-500">
                    A minting error occurred:{' '}
                    {mintError ||
                      'Contract reverted. You may have already minted for this round.'}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
