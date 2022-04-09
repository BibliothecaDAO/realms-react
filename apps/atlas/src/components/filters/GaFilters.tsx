import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useGaContext } from '@/context/GaContext';
import { OrdersFilter } from './OrdersFilter';
import { SearchFilter } from './SearchFilter';

export function GaFilters() {
  const { state, actions } = useGaContext();

  return (
    <div className="flex flex-wrap justify-between mb-2">
      <div className="w-full my-1 sm:w-auto">
        <SearchFilter
          placeholder="SEARCH BY ID"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <div className="flex items-center justify-center">
        <OrdersFilter
          selectedValues={state.selectedOrders}
          onChange={actions.updateSelectedOrders}
        />
        <BagRatingFilter
          rating={state.ratingFilter}
          onChange={actions.updateRatingFilter}
        />
      </div>
    </div>
  );
}
