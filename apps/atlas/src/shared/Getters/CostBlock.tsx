import { ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { useGameConstants } from '@/hooks/settling/useGameConstants';

export const CostBlock = ({ resourceName, amount, id, qty }) => {
  const { checkUserHasResources } = useGameConstants();

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
