import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useGaContext } from '@/context/GaContext';
import { BaseFilter } from './BaseFilter';
import { OrdersFilter } from './OrdersFilter';

export function GaFilters() {
  const { state, actions } = useGaContext();

  return (
    <BaseFilter>
      <OrdersFilter
        selectedValues={state.selectedOrders}
        onChange={actions.updateSelectedOrders}
        popoverClass="left-32"
      />
      <BagRatingFilter
        rating={state.ratingFilter}
        onChange={actions.updateRatingFilter}
      />
    </BaseFilter>
  );
}
