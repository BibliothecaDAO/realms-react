
import { UserRejectedRequestError } from "@web3-react/walletconnect-connector";
import axios from "axios";

import { useStarknet } from "~/hooks/useStarknet";
import Button from "~/shared/Button";
import UserAgentConnector from "~/shared/UserAgentConnector";
import { getBagsInWallet } from "loot-sdk";
import { messageKey } from "~/util/messageKey";
import classNames from "classnames";
import MintRequirements from "./MintRequirements";
import ElementsLabel from "~/shared/ElementsLabel";
import { useState, useEffect } from "react";

import { useWalletContext } from "~/hooks/useWalletContext";
import { getLatestGameIndex } from "~/util/minigameApi";
import { AddTransactionResponse } from "starknet";
import { MintingError } from "~/../pages/api/minigame_alpha_mint";
import useTxQueue from "~/hooks/useTxQueue";
import { getSelectorFromName } from "starknet/dist/utils/stark";
import Check from "../../../public/svg/check.svg";

type Prop = {
  initialTab?: TabName;
  onReceivedTx?: (txHash: string) => void;
};

type TabName =
  | "connect-ethereum"
  | "mint-requirements"
  | "connect-starknet"
  | "mint";

export const Bridge: React.FC<Prop> = (props) => {
  const starknet = useStarknet({ eagerConnect: false });
  /*const { error, chainId, active, activate, account, library } =
    useWeb3React<Web3Provider>();

  useEagerConnect();*/
  const {
    account,
    signer,
    connectWallet,
    isConnected,
    disconnectWallet,
    displayName,
  } = useWalletContext();

  const [gameIdx, setGameIdx] = useState<string>();
  const [mintError, setMintError] = useState<string>();

  const [transactionHash, setTransactionHash] = useState<string>();

  const txQueue = useTxQueue();

  useEffect(() => {
    if (transactionHash) {
      txQueue.addTransactionToQueue(
        transactionHash,
        getSelectorFromName("mint_elements")
      );
      // TODO: re-enable once better implementation of loading
      // if (props.onReceivedTx) {
      //   props.onReceivedTx(transactionHash);
      // }
    }
  }, [transactionHash]);

  useEffect(() => {
    getLatestGameIndex()
      .then((val) => setGameIdx(val))
      .catch((e) => {
        // TODO: Handle error
        console.error(e);
      });
  }, []);

  /*if (error instanceof UserRejectedRequestError) {
    console.log("TODO: Handle user rejection");
  }*/

  const [side, setSide] = useState<"light" | "dark">();

  /*const [unsupportedChain, setUnsupportedChain] = useState(chainId !== 1); // 1 is Ethereum Mainnet

  useEffect(() => {
    setUnsupportedChain(error instanceof UnsupportedChainIdError);
  }, [error]);*/

  const [currentTab, setCurrentTab] = useState<TabName>(
    props.initialTab || "connect-ethereum"
  );

  const verifyAndMint = async () => {
    if (signer) {
      const sig = await signer.signMessage(
        messageKey(starknet.address as string)
      );
      const res = await axios.post<AddTransactionResponse | MintingError>(
        "/api/minigame_alpha_mint",
        {
          starknetAddress: starknet.address,
          sig,
          chosenSide: side,
          gameIdx,
        }
      );

      if ("code" in res.data && res.data.code == "TRANSACTION_RECEIVED") {
        setTransactionHash(res.data.transaction_hash);
        setMintError(undefined);
      }
      if ("error" in res.data) {
        setMintError(res.data.error);
        setTransactionHash(undefined);
      }
    }
  };

  const tabBtnClasses = {
    base: "px-4 py-2 my-2 mx-2 text-gray-800 rounded-sm hover:bg-gray-100 hover:text-gray-800",
    active: "text-white bg-gray-200",
  };

  const connectedClassname =
    "inline-block py-2 mt-4 break-words px-4 backdrop-blur-md bg-white/30 rounded-md";

  const mintTxStatus = txQueue.status[getSelectorFromName("mint_elements")];
  useEffect(() => {
    starknet.connect();
    if (account) {
      setCurrentTab("mint-requirements");
    }
  }, []);
  return (
    <div className="w-full mx-auto sm:w-1/2 pt-40">
      <div className="p-4 mx-2 mt-4 backdrop-blur-md bg-white/60 rounded-lg">
        <h1 className="mb-8 px-2 mt-4">
          <ElementsLabel>Desiege Setup</ElementsLabel>
        </h1>
        <div className="text-gray-800 px-2">
          <nav className="backdrop-blur-md bg-white/70 rounded-md">
            <span>
              <button
                onClick={() => setCurrentTab("connect-ethereum")}
                className={classNames(
                  tabBtnClasses.base,
                  currentTab == "connect-ethereum" ? tabBtnClasses.active : null
                )}
              >
                <span className="flex">
                  1. Connect Ethereum
                  {account ? <Check className="ml-1" /> : null}
                </span>
              </button>
            </span>
            <span>
              <button
                onClick={() => setCurrentTab("mint-requirements")}
                className={classNames(
                  tabBtnClasses.base,
                  currentTab == "mint-requirements"
                    ? tabBtnClasses.active
                    : null
                )}
              >
                <span className="flex">
                  2. Lords Balance
                  {account ? <Check className="ml-1" /> : null}
                </span>
              </button>
            </span>
            <span>
              <button
                onClick={() => setCurrentTab("connect-starknet")}
                className={classNames(
                  tabBtnClasses.base,
                  currentTab == "connect-starknet" ? tabBtnClasses.active : null
                )}
              >
                <span className="flex">
                  3. Connect StarkNet
                  {account ? <Check className="ml-1" /> : null}
                </span>
              </button>
            </span>
            <button
              onClick={() => setCurrentTab("mint")}
              className={classNames(
                tabBtnClasses.base,
                currentTab == "mint" ? tabBtnClasses.active : null
              )}
            >
              <span className="flex">
                4. Mint <ElementsLabel>ELEMENTS</ElementsLabel>
                {account ? <Check className="ml-1" /> : null}
              </span>
            </button>
          </nav>
          <div className="text-xl">
            {currentTab == "connect-ethereum" ? (
              <div>
                {account ? (
                  <p className={connectedClassname}>Connected as {account}</p>
                ) : (
                  <button
                    className="mt-4 mr-2 text-black"
                    onClick={connectWallet}
                  >
                    Connect to Lootverse
                  </button>
                )}
                {/* TODO
                {unsupportedChain ? (
                  <p className="mt-2">
                    Wrong Network. Please switch to Ethereum mainnet.
                  </p>
                ) : null} */}
              </div>
            ) : null}
            {currentTab == "mint-requirements" ? (
              <div className="py-4">
                <MintRequirements l1Address={account.toString()} />
              </div>
            ) : null}
            {currentTab == "connect-starknet" ? (
              <div className="py-4">
                {starknet.active && starknet.address ? (
                  <p className={connectedClassname}>
                    Connected as {starknet.address}
                  </p>
                ) : (
                  <div>
                    <p className="text-2xl">
                      If you haven&apos;t already done so, please{" "}
                      <a
                        rel="noreferrer"
                        target="_blank"
                        className="underline"
                        href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                      >
                        download and install
                      </a>{" "}
                      the ArgentX extension, available now for the Google Chrome
                      web browser.
                    </p>
                    <Button onClick={() => starknet.connect()} className="mt-4">
                      Connect to ArgentX
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
            {currentTab === "mint" ? (
              <div className="py-4">
                {starknet.active && starknet.address ? (
                  <>
                    <h1 className="my-8 text-4xl">Pick your Allegiance</h1>
                    <div className="flex w-full space-x-2 ">
                      <div className="relative group w-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt w-full text-center"></div>
                        <button
                          onClick={() => setSide("light")}
                          className="w-full relative px-7 py-4 bg-white text-pink-400 rounded-lg leading-none items-center divide-x divide-gray-600 text-center uppercase tracking-widest"
                        >
                          <span className="flex justify-center">
                            {" "}
                            Light{" "}
                            {side == "light" ? (
                              <Check className="ml-1" />
                            ) : null}
                          </span>
                        </button>
                      </div>
                      <div className="relative group w-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt w-full text-center"></div>
                        <button
                          onClick={() => setSide("dark")}
                          className="w-full relative px-7 py-4 bg-black rounded-lg leading-none text-white items-center divide-x divide-gray-600 text-center uppercase tracking-widest flex justify-center"
                        >
                          Dark{" "}
                          {side == "dark" ? <Check className="ml-1" /> : null}
                        </button>
                      </div>
                    </div>

                    {mintTxStatus == "accepted" ? (
                      <p>Minting succeeded. Please refresh your browser.</p>
                    ) : null}

                    {mintTxStatus == "loading" ? (
                      <>
                        <p className="mt-8 text-2xl animate-bounce">
                          Minting...
                        </p>
                        <p>
                          Please wait, StarkNet is still in alpha. Your
                          transaction is being executed on the sequencer.
                        </p>
                        <a
                          // TODO: Choose host dynamically here based on network
                          href={`https://goerli.voyager.online/tx/${transactionHash}/`}
                          className="underline"
                          target={"_blank"}
                          rel="noopener noreferrer"
                        >
                          Check Transaction Status
                        </a>
                      </>
                    ) : (
                      <>
                        {side !== undefined && transactionHash == undefined ? (
                          <>
                            <p className="mt-8 break-words text-2xl">
                              {messageKey(starknet.address as string)}
                            </p>
                            <p className={connectedClassname}>
                              {starknet.address}
                            </p>

                            <Button
                              className="mt-4"
                              onClick={() => verifyAndMint()}
                            >
                              Sign and Mint
                            </Button>
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                ) : null}
                {mintError !== undefined || mintTxStatus == "rejected" ? (
                  <p>A minting error occurred: {mintError}</p>
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
