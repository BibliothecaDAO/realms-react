import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useLootContext } from '@/context/LootContext';
import { SearchFilter } from './SearchFilter';

export function LootFilters() {
  const { state, actions } = useLootContext();

  return (
    <div className="flex justify-between">
      <div>
        <SearchFilter
          placeholder="SEARCH BY ID"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <div className="flex mb-4">
        <BagRatingFilter
          rating={state.ratingFilter}
          onChange={actions.updateRatingFilter}
        />
      </div>
    </div>
  );
}
