import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useLootContext } from '@/context/LootContext';
import { SearchFilter } from './SearchFilter';

export function LootFilters() {
  const { state, actions } = useLootContext();

  return (
    <div className="flex justify-between my-2">
      <div className="w-full sm:w-auto">
        <SearchFilter
          placeholder="SEARCH BY ID"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <div className="flex">
        <BagRatingFilter
          rating={state.ratingFilter}
          onChange={actions.updateRatingFilter}
        />
      </div>
    </div>
  );
}
