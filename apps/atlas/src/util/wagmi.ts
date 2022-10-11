import { getDefaultClient } from 'connectkit';
import { chain, configureChains, createClient } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const supportedChains =
  process.env.NEXT_PUBLIC_NETWORK === 'goerli'
    ? [chain.goerli]
    : [chain.mainnet];

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
