import { useEffect, useState } from 'react';
import { number } from 'starknet';
import { useBankContext } from '@/context/BankContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';

type Props = {
  /*
  Resource costs keyed by resource ID. Values must have correct amount of decimals.
  This is passed in so that the costs are agnostic for multiple entities (buildings, etc...)
  */
  resourceCosts: Record<number, number.BigNumberish>;
};
/*
  Function that compares Resource balance in wallet with a cost
  and returns amount deficits.
*/
const useResourcesDeficit = (props: Props) => {
  const { resourceCosts } = props;

  const [deficits, setDeficits] = useState<Record<number, number.BigNumberish>>(
    {}
  );

  const resources = useBankContext();

  const { balance, balanceStatus } = useUserBalancesContext();

  useEffect(() => {
    if (Object.keys(resourceCosts).length > 0 && balanceStatus == 'success') {
      const deficits = {};
      balance.forEach((r) => {
        const amount = number.toBN(r.amount, 10);
        if (resourceCosts[r.resourceId]) {
          const costBN = number.toBN(resourceCosts[r.resourceId]);
          if (amount.sub(costBN).lte(number.toBN(0))) {
            deficits[r.resourceId] = costBN.sub(amount);
          }
        }
      });

      setDeficits(deficits);
    }
  }, [resourceCosts, balanceStatus, balance]);

  return {
    deficits,
    ...resources,
  };
};

export default useResourcesDeficit;
