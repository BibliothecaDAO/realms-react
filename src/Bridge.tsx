import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import { UserRejectedRequestError } from "@web3-react/walletconnect-connector";
import { useEffect } from "react";
import axios from "axios";

import { useStarknet } from "./hooks/useStarknet";
import Button from "../src/shared/Button";
import UserAgentConnector from "./shared/UserAgentConnector";
import { Web3Provider } from "@ethersproject/providers";
import { messageKey } from "./util/messageKey";

const Bridge: React.FC = () => {
  const starknet = useStarknet();
  const { error, active, activate, account, library } =
    useWeb3React<Web3Provider>();

  if (error instanceof UserRejectedRequestError) {
    console.log("TODO: Handle user rejection");
  }
  if (error instanceof UnsupportedChainIdError) {
    console.log("TODO: Handle unsupported chain");
  }

  useEffect(() => {
    if (account && library) {
      // TODO: Load L1 assets and preview what'll be minted on L2
    }
  }, [account]);

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

  return (
    <>
      {active && library ? (
        <code>{account}</code>
      ) : (
        <UserAgentConnector>
          {(connector: any) => (
            <Button
              onClick={() => {
                activate(connector);
              }}
            >
              Connect Ethereum
            </Button>
          )}
        </UserAgentConnector>
      )}

      {starknet.active ? (
        <>
          <code>{starknet.address}</code>
          {/* Dapp here */}
        </>
      ) : (
        <>
          <Button onClick={starknet.connect}>Connect StarkNet</Button>
        </>
      )}

      {active && starknet.active ? (
        <Button onClick={verifyAndMint}>Verify L1 Assets</Button>
      ) : null}
    </>
  );
};

export default Bridge;
