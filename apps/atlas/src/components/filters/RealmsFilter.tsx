import { OrdersFilter } from '@/components/filters/OrdersFilter';
import { RarityFilter } from '@/components/filters/RarityFilter';
import { ResourcesFilter } from '@/components/filters/ResourcesFilter';
import { TraitsFilter } from '@/components/filters/TraitsFilter';
import { useSettlingContext } from '@/context/SettlingContext';

export function RealmsFilter() {
  const settling = useSettlingContext();

  return (
    <div className="flex justify-between">
      <div>Search</div>
      <div className="flex mb-4">
        <ResourcesFilter
          selectedValues={settling.state.selectedResources}
          onChange={settling.actions.updateSelectedResources}
        />
        <RarityFilter
          rarity={settling.state.rarityFilter}
          onChange={settling.actions.updateRarityFilter}
        />
        <OrdersFilter
          selectedValues={settling.state.selectedOrders}
          onChange={settling.actions.updateSelectedOrders}
        />
        <TraitsFilter
          traits={settling.state.traitsFilter}
          onChange={settling.actions.updateTraitsFilter}
        />
      </div>
    </div>
  );
}
