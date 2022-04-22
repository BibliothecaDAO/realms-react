export const getHostname = (starknetNetwork: string) => {
  switch (starknetNetwork) {
    case 'mainnet-alpha':
      return 'voyager.online';
    case 'goerli-alpha':
      return 'goerli.voyager.online';
    default:
      throw new Error(`Unknown network: ${starknetNetwork}`);
  }
};
