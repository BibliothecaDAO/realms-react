import { BigNumber } from 'ethers';
import { useUserBalancesContext } from '@/context/UserBalancesContext';

// TODO this should be refactored (doesnt need user balances for getting constants)
export const useGameConstants = () => {
  const { balance, gameConstants } = useUserBalancesContext();

  const getBuildingCostById = (id) => {
    return gameConstants?.buildingCosts.find((a) => a.buildingId === id);
  };

  const checkUserHasAvailableResources = ({ cost, id }) => {
    const co = BigNumber.from(parseInt(cost).toFixed().toString());

    const baseBn = BigNumber.from('1000000000000000000').mul(co);

    const currentBalance =
      balance.find((a) => a.resourceId === id)?.amount || 0;

    return BigNumber.from(currentBalance).gte(baseBn) ? true : false;
  };

  const checkUserHasCheckoutResources = ({ cost, id }) => {
    const co = BigNumber.from(parseInt(cost).toFixed().toString());

    const baseBn = BigNumber.from('1000000000000000000').mul(co);

    const currentBalance =
      balance.find((a) => a.resourceId === parseInt(id))?.checkoutAmount || 0;

    return BigNumber.from(currentBalance).gte(baseBn) ? true : false;
  };

  return {
    gameConstants,
    checkUserHasAvailableResources,
    checkUserHasCheckoutResources,
    getBuildingCostById,
  };
};
