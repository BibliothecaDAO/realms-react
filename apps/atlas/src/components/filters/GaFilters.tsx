import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useGaContext } from '@/context/GaContext';
import { OrdersFilter } from './OrdersFilter';
import { SearchFilter } from './SearchFilter';

export function GaFilters() {
  const { state, actions } = useGaContext();

  return (
    <div className="flex justify-between">
      <div>
        {' '}
        <SearchFilter
          placeholder="SEARCH BY ID"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <div className="flex mb-4">
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
