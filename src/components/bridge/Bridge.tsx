import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import { UserRejectedRequestError } from "@web3-react/walletconnect-connector";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";

import { useStarknet } from "hooks/useStarknet";
import Button from "shared/Button";
import UserAgentConnector from "shared/UserAgentConnector";
import { Web3Provider } from "@ethersproject/providers";
import { Tab } from "@headlessui/react";
import { getBagsInWallet } from "loot-sdk";
import { messageKey } from "util/messageKey";
import classNames from "classnames";
import MintRequirements from "./MintRequirements";
import TokenLabel from "shared/TokenLabel";

type Prop = {};

type TabNames = "connect-ethereum" | "preview-mint" | "connect-starknet";

export const Bridge: React.FC<Prop> = (props) => {
  const starknet = useStarknet();
  const { error, active, activate, account, library } =
    useWeb3React<Web3Provider>();

  if (error instanceof UserRejectedRequestError) {
    console.log("TODO: Handle user rejection");
  }
  if (error instanceof UnsupportedChainIdError) {
    console.log("TODO: Handle unsupported chain");
  }

  const verifyAndMint = async () => {
    const sig = await library
      ?.getSigner()
      .signMessage(messageKey(starknet.address as string));
    const res = await axios.post("/api/minigame_alpha_mint", {
      starknetAddress: starknet.address,
      sig,
    });
    console.log(res);
  };

  console.log(error);

  const tabBtnClasses = {
    base: "px-4 py-2 my-2 mx-2 text-white rounded-sm hover:bg-gray-200 hover:text-gray-800",
    active: "text-white bg-gray-600",
  };

  return (
    <div className="w-full sm:w-1/2">
      <div className="p-2 mt-2 mb-4 bg-gray-700 rounded-lg ">
        <Tab.Group>
          <Tab.List className="bg-gray-800 rounded-md">
            <Tab as="span">
              {({ selected }) => (
                <button
                  className={classNames(
                    tabBtnClasses.base,
                    selected ? tabBtnClasses.active : null
                  )}
                >
                  1. Connect Ethereum
                </button>
              )}
            </Tab>
            <Tab as="span">
              {({ selected }) => (
                <button
                  className={classNames(
                    tabBtnClasses.base,
                    selected ? tabBtnClasses.active : null
                  )}
                >
                  2. Review Polarity
                </button>
              )}
            </Tab>
            <Tab as="span">
              {({ selected }) => (
                <button
                  className={classNames(
                    tabBtnClasses.base,
                    selected ? tabBtnClasses.active : null
                  )}
                >
                  3. Connect StarkNet
                </button>
              )}
            </Tab>
            <Tab as="span">
              {({ selected }) => (
                <button
                  className={classNames(
                    tabBtnClasses.base,
                    selected ? tabBtnClasses.active : null
                  )}
                >
                  4. Mint<TokenLabel>ELEMENTS</TokenLabel>
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className={"text-white"}>
            <Tab.Panel className="p-4">
              <p>
                Let's review the items in your Ethereum wallet to determine the
                polarity of their <TokenLabel>ELEMENTS</TokenLabel>, and the
                quantities that your holdings can produce.
              </p>
              {account ? (
                <p className="mt-2">Connected as {account}</p>
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
            </Tab.Panel>
            <Tab.Panel className="p-4">
              <MintRequirements l1Address={account} />
            </Tab.Panel>
            <Tab.Panel className="gap-4 p-4">
              <h3 className="text-xl">StarkNet Account</h3>
              <p>
                The Realms Tower Defence game is powered using the{" "}
                <a
                  className="underline"
                  target={"_blank"}
                  href="https://starkware.co/starknet/"
                >
                  StarkNet
                </a>{" "}
                rollup execution layer. ArgentX is the most secure StarkNet
                wallet available.
              </p>
              <p>
                If you haven't already done so, please{" "}
                <a
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
                <p className="mt-2 text-xs">Connected as {starknet.address}</p>
              ) : (
                <Button onClick={() => starknet.connect()} className="mt-4">
                  Connect to ArgentX
                </Button>
              )}
            </Tab.Panel>
            <Tab.Panel className="p-4">
              {starknet.active ? (
                <>
                  <p>{messageKey(starknet.address as string)}</p>
                  <Button className="mt-4" onClick={() => verifyAndMint()}>
                    Sign
                  </Button>
                </>
              ) : null}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Bridge;
