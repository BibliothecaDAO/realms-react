import { BagRatingFilter } from '@/app/components/filters/BagRatingFilter';
import { useLootContext } from '@/context/LootContext';
import { BaseFilter } from './BaseFilter';

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
