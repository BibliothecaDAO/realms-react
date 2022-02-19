import axios from "axios";

import {
  useStarknet,
  useStarknetTransactionManager,
} from "@starknet-react/core";
import Button from "~/shared/Button";
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
  const starknet = useStarknet();
  const txManager = useStarknetTransactionManager();
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

  useEffect(() => {
    if (transactionHash) {
      txManager.addTransaction({
        transactionHash,
        address: starknet.account as string,
        status: "TRANSACTION_RECEIVED",
      });
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
    props.initialTab || "mint"
  );

  const verifyAndMint = async () => {
    if (signer) {
      const sig = await signer.signMessage(
        messageKey(starknet.account as string)
      );
      const res = await axios.post<AddTransactionResponse | MintingError>(
        "/api/minigame_alpha_mint",
        {
          starknetAddress: starknet.account,
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
    "inline-block py-2 mt-4 break-words px-4 bg-white/30 rounded-md";

  const mintTx = txManager.transactions.find(
    (s) => s.transactionHash == transactionHash
  );

  useEffect(() => {
    starknet.connectBrowserWallet();
  }, []);
  return (
    <div className="w-full pt-4 sm:w-1/2">
      <div className="p-4 mx-2 mt-4 rounded-lg bg-white/60">
        <h1 className="px-2 mt-4 mb-8">
          <ElementsLabel>Desiege Setup</ElementsLabel>
        </h1>
        <div className="px-2 text-gray-800">
          <nav className="rounded-md bg-white/70">
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
                {!!starknet.account ? (
                  <p className={connectedClassname}>
                    Connected as {starknet.account}
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
            {currentTab === "mint" ? (
              <div className="py-4">
                {!!starknet.account ? (
                  <>
                    <h1 className="my-8 text-4xl">Pick your Allegiance</h1>
                    <div className="flex w-full space-x-2 ">
                      <div className="relative w-full group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt w-full text-center"></div>
                        <button
                          onClick={() => setSide("light")}
                          className="relative items-center w-full py-4 leading-none tracking-widest text-center text-pink-400 uppercase bg-white divide-x divide-gray-600 rounded-lg px-7"
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
                      <div className="relative w-full group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt w-full text-center"></div>
                        <button
                          onClick={() => setSide("dark")}
                          className="relative flex items-center justify-center w-full py-4 leading-none tracking-widest text-center text-white uppercase bg-black divide-x divide-gray-600 rounded-lg px-7"
                        >
                          Dark{" "}
                          {side == "dark" ? <Check className="ml-1" /> : null}
                        </button>
                      </div>
                    </div>

                    {mintTx?.status == "ACCEPTED_ON_L2" ? (
                      <p className="mt-4 text-xl text-green-800">
                        Minting succeeded. Please refresh your browser.
                      </p>
                    ) : null}

                    {mintTx?.status == "PENDING" ||
                    mintTx?.status == "RECEIVED" ? (
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
                            <p className="mt-8 text-2xl break-words">
                              {messageKey(starknet.account as string)}
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
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                ) : null}
                {mintError !== undefined || mintTx?.status == "REJECTED" ? (
                  <p className="mt-4 text-red-500">
                    A minting error occurred:{" "}
                    {mintError ||
                      "Contract reverted. You may have already minted for this round."}
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
