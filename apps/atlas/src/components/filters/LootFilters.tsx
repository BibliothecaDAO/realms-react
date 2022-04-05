import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useLootContext } from '@/context/LootContext';

export function LootFilters() {
  const lootCtx = useLootContext();

  return (
    <div className="flex justify-between">
      <div>Search</div>
      <div className="flex mb-4">
        <BagRatingFilter
          rating={lootCtx.state.ratingFilter}
          onChange={lootCtx.actions.updateRatingFilter}
        />
      </div>
    </div>
  );
}
