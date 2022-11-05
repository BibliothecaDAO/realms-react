import { ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { BigNumber } from 'ethers';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useGameConstants } from '@/hooks/settling/useGameConstants';

export const CostBlock = ({ resourceName, amount, id, qty }) => {
  const { balance } = useResourcesContext();

  const checkUserHasResources = ({ cost, id }) => {
    const co = BigNumber.from((cost * 10 ** 18).toString());
    const currentBalance =
      balance.find((a) => a.resourceId === id)?.amount || 0;

    return BigNumber.from(currentBalance).gte(co) ? true : false;
  };

  return (
    <div className="px-1 font-extrabold text-center font-display">
      <ResourceIcon withTooltip size="xs" resource={resourceName} />
      <span
        className={
          checkUserHasResources({
            cost: amount * qty,
            id: id,
          })
            ? 'text-green-600 shadow-green-100 drop-shadow-lg'
            : 'text-red-200'
        }
      >
        {amount * qty}
      </span>
    </div>
  );
};
