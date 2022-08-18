import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useGaContext } from '@/context/GaContext';
import { OrdersFilter } from './OrdersFilter';
import { SearchFilter } from './SearchFilter';

export function GaFilters() {
  const { state, actions } = useGaContext();

  return (
    <div className="flex flex-wrap justify-between mb-2">
      <div className="flex items-center justify-center gap-2">
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
