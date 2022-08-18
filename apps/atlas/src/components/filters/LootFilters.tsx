import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useLootContext } from '@/context/LootContext';

export function LootFilters() {
  const { state, actions } = useLootContext();

  return (
    <div className="flex flex-wrap justify-between gap-2 px-2 bg-black">
      <div className="flex self-center">
        <BagRatingFilter
          rating={state.ratingFilter}
          onChange={actions.updateRatingFilter}
        />
      </div>
    </div>
  );
}
