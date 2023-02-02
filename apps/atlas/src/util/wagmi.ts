import { getDefaultClient } from 'connectkit';
import type { Chain } from 'wagmi';
import { configureChains, createClient } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const supportedChains: [Chain] =
  process.env.NEXT_PUBLIC_NETWORK === 'goerli' ? [goerli] : [mainnet];

export const { chains, provider, webSocketProvider } = configureChains(
  supportedChains,
  [
    infuraProvider({
      apiKey: 'd55e01eb6d8e4003a472cb13e3fc3d77',
    }),
    publicProvider(),
  ]
);

export const wagmiClient = createClient(
  getDefaultClient({
    appName: 'Realms Eternum',
    chains,
    autoConnect: true,
    provider,
  })
);
