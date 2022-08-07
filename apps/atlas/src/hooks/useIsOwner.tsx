import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';

const useIsOwner = (owner?: string | null) => {
  const { account } = useStarknet();
  const starknetWallet = account ? BigNumber.from(account).toHexString() : '';
  console.log(owner);
  console.log(account);
  if (account) {
    return starknetWallet == owner ? true : false;
  } else {
    return false;
  }
};

export default useIsOwner;
