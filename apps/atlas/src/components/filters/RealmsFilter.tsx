import { OrdersFilter } from '@/components/filters/OrdersFilter';
import { RealmsRarityFilter } from '@/components/filters/RealmsRarityFilter';
import { ResourcesFilter } from '@/components/filters/ResourcesFilter';
import { TraitsFilter } from '@/components/filters/TraitsFilter';
import { useRealmContext } from '@/context/RealmContext';

export function RealmsFilter() {
  const realmCtx = useRealmContext();

  return (
    <div className="flex justify-between">
      <div>Search</div>
      <div className="flex mb-4">
        <ResourcesFilter
          selectedValues={realmCtx.state.selectedResources}
          onChange={realmCtx.actions.updateSelectedResources}
        />
        <RealmsRarityFilter
          rarity={realmCtx.state.rarityFilter}
          onChange={realmCtx.actions.updateRarityFilter}
        />
        <OrdersFilter
          selectedValues={realmCtx.state.selectedOrders}
          onChange={realmCtx.actions.updateSelectedOrders}
        />
        <TraitsFilter
          traits={realmCtx.state.traitsFilter}
          onChange={realmCtx.actions.updateTraitsFilter}
        />
      </div>
    </div>
  );
}
