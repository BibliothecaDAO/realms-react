import { BagRatingFilter } from '@/components/ui/filters/BagRatingFilter';
import { BaseFilter } from '@/components/ui/filters/BaseFilter';
import { useGaContext } from '@/context/GaContext';
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
