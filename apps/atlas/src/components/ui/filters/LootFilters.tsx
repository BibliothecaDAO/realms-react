import { BagRatingFilter } from '@/components/ui/filters/BagRatingFilter';
import { BaseFilter } from '@/components/ui/filters/BaseFilter';
import { useLootContext } from '@/context/LootContext';
export function LootFilters() {
  const { state, actions } = useLootContext();

  return (
    <BaseFilter>
      <BagRatingFilter
        rating={state.ratingFilter}
        onChange={actions.updateRatingFilter}
      />
    </BaseFilter>
  );
}
