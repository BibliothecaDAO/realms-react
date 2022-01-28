import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import { UserRejectedRequestError } from "@web3-react/walletconnect-connector";
import axios from "axios";

import { useStarknet } from "~/hooks/useStarknet";
import Button from "~/shared/Button";
import UserAgentConnector from "~/shared/UserAgentConnector";
import { Web3Provider } from "@ethersproject/providers";
import { getBagsInWallet } from "loot-sdk";
import { messageKey } from "~/util/messageKey";
import classNames from "classnames";
import MintRequirements from "./MintRequirements";
import ElementsLabel from "~/shared/ElementsLabel";
import { useState, useEffect } from "react";
import { useEagerConnect } from "~/hooks/useWeb3";
import { getLatestGameIndex } from "~/util/minigameApi";
import { AddTransactionResponse } from "starknet";
import { MintingError } from "~/../pages/api/minigame_alpha_mint";

type Prop = {
  initialTab?: TabName;
};

type TabName =
  | "connect-ethereum"
  | "mint-requirements"
  | "connect-starknet"
  | "mint";

export const Bridge: React.FC<Prop> = (props) => {
  const starknet = useStarknet({ eagerConnect: true });
  const { error, chainId, active, activate, account, library } =
    useWeb3React<Web3Provider>();

  useEagerConnect();

  const [gameIdx, setGameIdx] = useState<string>();
  const [mintError, setMintError] = useState<string>();

  const [transactionHash, setTransactionHash] = useState<string>();

  useEffect(() => {
    getLatestGameIndex()
      .then((val) => setGameIdx(val))
      .catch((e) => {
        // TODO: Handle error
        console.error(e);
      });
  }, []);

  if (error instanceof UserRejectedRequestError) {
    console.log("TODO: Handle user rejection");
  }

  const [side, setSide] = useState<"light" | "dark">();

  const [unsupportedChain, setUnsupportedChain] = useState(chainId !== 1); // 1 is Ethereum Mainnet

  useEffect(() => {
    setUnsupportedChain(error instanceof UnsupportedChainIdError);
  }, [error]);

  const [currentTab, setCurrentTab] = useState<TabName>(
    props.initialTab || "connect-ethereum"
  );

  const verifyAndMint = async () => {
    const sig = await library
      ?.getSigner()
      .signMessage(messageKey(starknet.address as string));
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
  };

  const tabBtnClasses = {
    base: "px-4 py-2 my-2 mx-2 text-white text-xs rounded-sm hover:bg-gray-200 hover:text-gray-800",
    active: "text-white bg-gray-600",
  };

  const connectedClassname =
    "inline-block py-2 mt-4 break-words px-4 bg-green-800 rounded-md";

  return (
    <div className="w-full mx-auto sm:w-1/2">
      <div className="p-2 mx-2 mt-4 bg-gray-700 border-2 border-black rounded-lg">
        <div>
          <nav className="bg-gray-800 rounded-md">
            <span>
              <button
                onClick={() => setCurrentTab("connect-ethereum")}
                className={classNames(
                  tabBtnClasses.base,
                  currentTab == "connect-ethereum" ? tabBtnClasses.active : null
                )}
              >
                1. Connect Ethereum
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
                2. Review Polarity
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
                3. Connect StarkNet
              </button>
            </span>
            <button
              onClick={() => setCurrentTab("mint")}
              className={classNames(
                tabBtnClasses.base,
                currentTab == "mint" ? tabBtnClasses.active : null
              )}
            >
              4. Mint<ElementsLabel>ELEMENTS</ElementsLabel>
            </button>
          </nav>
          <div className={"text-white"}>
            {currentTab == "connect-ethereum" ? (
              <div className="p-4">
                <p>
                  Let&apos;s review the items in your Ethereum wallet to
                  determine the polarity of their{" "}
                  <ElementsLabel>ELEMENTS</ElementsLabel>.
                </p>
                {account ? (
                  <p className={connectedClassname}>Connected as {account}</p>
                ) : (
                  <UserAgentConnector>
                    {(connectors) =>
                      connectors.map((c, i) => (
                        <Button
                          key={c.name}
                          onClick={() => activate(c.connector as any)}
                          className="mt-4 mr-2 text-black"
                        >
                          {c.name}
                        </Button>
                      ))
                    }
                  </UserAgentConnector>
                )}
                {unsupportedChain ? (
                  <p className="mt-2">
                    Wrong Network. Please switch to Ethereum mainnet.
                  </p>
                ) : null}
              </div>
            ) : null}
            {currentTab == "mint-requirements" ? (
              <div className="p-4">
                <MintRequirements l1Address={account} />
              </div>
            ) : null}
            {currentTab == "connect-starknet" ? (
              <div className="p-4">
                <p>
                  If you haven&apos;t already done so, please{" "}
                  <a
                    rel="noreferrer"
                    target="_blank"
                    className="underline"
                    href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                  >
                    download and install
                  </a>{" "}
                  the ArgentX extension, available now for the Google Chrome web
                  browser.
                </p>
                {starknet.active && starknet.address ? (
                  <p className={""}>Connected as {starknet.address}</p>
                ) : (
                  <Button onClick={() => starknet.connect()} className="mt-4">
                    Connect to ArgentX
                  </Button>
                )}
              </div>
            ) : null}
            {currentTab === "mint" ? (
              <div className="p-4">
                {starknet.active && starknet.address ? (
                  <>
                    <p className="mb-4 text-2xl">Choose your side</p>
                    <button
                      onClick={() => setSide("light")}
                      className={classNames(
                        "p-2 font-bold border rounded-md hover:bg-cyan-600",
                        side == "light" ? "bg-cyan-600" : null
                      )}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setSide("dark")}
                      className={classNames(
                        "p-2 ml-2 font-bold border rounded-md hover:bg-purple-800",
                        side == "dark" ? "bg-purple-800" : null
                      )}
                    >
                      Dark
                    </button>

                    {side !== undefined ? (
                      <>
                        <p className="mt-4 break-words">
                          {messageKey(starknet.address as string)}
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
                ) : null}
                {transactionHash !== undefined ? (
                  <p>Minting succeeded! Transaction hash: {transactionHash}</p>
                ) : null}
                {mintError !== undefined ? (
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
