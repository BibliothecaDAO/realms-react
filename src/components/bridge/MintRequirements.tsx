import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useEffect } from "react";

type Prop = {
  l1Address?: string | null;
};

const LORDS_TOKEN = "0x686f2404e77ab0d9070a46cdfb0b7fecdd2318b0";

const MintRequirements: React.FC<Prop> = (props) => {
  if (props.l1Address == undefined) {
    return <p>Please connect your Ethereum wallet to continue</p>;
  }

  useEffect(() => {
    if (props.l1Address) {
      // TODO: Get ERC20 token balance
    }
  }, []);

  return (
    <div>
      <h3 className="text-xl">Polarity for {props.l1Address}</h3>
      <p>Tokens</p>
      <ul>
        <li>Realms</li>
        <li>Loot</li>
      </ul>
      <p>Currencies</p>
      <ul>
        <li>LORDS</li>
      </ul>
    </div>
  );
};

export default MintRequirements;
