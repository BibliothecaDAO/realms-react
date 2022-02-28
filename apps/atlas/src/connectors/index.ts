/* eslint-disable @typescript-eslint/naming-convention */
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const ETH_MAINNET = 1;
const ETH_GOERLI = 5;

const RPC_URLS: { [chainId: number]: string } = {
  [ETH_MAINNET]:
    `https://mainnet.infura.io/v3/${process.env.INFURA_ID}` as string,
  [ETH_GOERLI]:
    `https://goerli.infura.io/v3/${process.env.INFURA_ID}` as string,
};

// Metamask
export const injected = new InjectedConnector({
  supportedChainIds: [ETH_MAINNET, ETH_GOERLI],
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [ETH_MAINNET]: RPC_URLS[ETH_MAINNET],
    [ETH_GOERLI]: RPC_URLS[ETH_GOERLI],
  },
  qrcode: true,
});
