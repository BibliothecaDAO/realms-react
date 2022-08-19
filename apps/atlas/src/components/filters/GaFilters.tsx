import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useGaContext } from '@/context/GaContext';
import { BaseFilter } from './BaseFilter';
import { OrdersFilter } from './OrdersFilter';
import { SearchFilter } from './SearchFilter';

export function GaFilters() {
  const { state, actions } = useGaContext();

  return (
    <BaseFilter>
      <OrdersFilter
        selectedValues={state.selectedOrders}
        onChange={actions.updateSelectedOrders}
      />
      <BagRatingFilter
        rating={state.ratingFilter}
        onChange={actions.updateRatingFilter}
      />
    </BaseFilter>
  );
}
