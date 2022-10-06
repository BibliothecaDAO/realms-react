import { useAccount } from '@starknet-react/core';
import { BigNumber } from 'ethers';

const useIsOwner = (owner?: string | null) => {
  const { address } = useAccount();
  const starknetWallet = address ? BigNumber.from(address).toHexString() : '';
  if (address) {
    return starknetWallet == owner ? true : false;
  } else {
    return false;
  }
};

export default useIsOwner;
