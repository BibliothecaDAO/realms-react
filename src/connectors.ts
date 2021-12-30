import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const ETH_MAINNET = 1;

const RPC_URLS: { [chainId: number]: string } = {
  [ETH_MAINNET]: process.env.RPC_URL_1 as string,
};

// Metamask
export const injected = new InjectedConnector({
  supportedChainIds: [ETH_MAINNET],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { [ETH_MAINNET]: RPC_URLS[ETH_MAINNET] },
  qrcode: true,
});
