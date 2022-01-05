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

type Prop = {};

type TabName =
  | "connect-ethereum"
  | "mint-requirements"
  | "connect-starknet"
  | "mint";

export const Bridge: React.FC<Prop> = (props) => {
  const starknet = useStarknet();
  const { error, chainId, active, activate, account, library } =
    useWeb3React<Web3Provider>();

  if (error instanceof UserRejectedRequestError) {
    console.log("TODO: Handle user rejection");
  }

  const [unsupportedChain, setUnsupportedChain] = useState(chainId !== 1); // 1 is Ethereum Mainnet

  useEffect(() => {
    setUnsupportedChain(error instanceof UnsupportedChainIdError);
  }, [error]);

  const [currentTab, setCurrentTab] = useState<TabName>("connect-ethereum");

  const verifyAndMint = async () => {
    const sig = await library
      ?.getSigner()
      .signMessage(messageKey(starknet.address as string));
    const res = await axios.post("/api/minigame_alpha_mint", {
      starknetAddress: starknet.address,
      sig,
    });
    // TODO: Do something with mint verification
    console.log(res);
  };

  const tabBtnClasses = {
    base: "px-4 py-2 my-2 mx-2 text-white rounded-sm hover:bg-gray-200 hover:text-gray-800",
    active: "text-white bg-gray-600",
  };

  const connectedClassname =
    "inline-block py-2 mt-4 break-words px-4 bg-green-800 rounded-md";

  return (
    <div className="w-full">
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
              <div className="gap-4 p-4">
                <h3 className="text-xl">StarkNet Account</h3>
                <p>
                  The Realms Tower Defence game is powered using{" "}
                  <a
                    rel="noreferrer"
                    className="underline"
                    target={"_blank"}
                    href="https://starkware.co/starknet/"
                  >
                    StarkNet
                  </a>
                  , a rollup execution layer verified on Ethereum.
                </p>
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
                {starknet.active ? (
                  <p className={connectedClassname}>
                    Connected as {starknet.address}
                  </p>
                ) : (
                  <Button onClick={() => starknet.connect()} className="mt-4">
                    Connect to ArgentX
                  </Button>
                )}
              </div>
            ) : null}
            {currentTab === "mint" ? (
              <div className="p-4">
                {starknet.active ? (
                  <>
                    <p className="break-words">
                      {messageKey(starknet.address as string)}
                    </p>
                    <Button className="mt-4" onClick={() => verifyAndMint()}>
                      Sign
                    </Button>
                  </>
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
