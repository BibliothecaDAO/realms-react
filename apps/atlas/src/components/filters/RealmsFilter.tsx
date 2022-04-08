import { OrdersFilter } from '@/components/filters/OrdersFilter';
import { RealmsRarityFilter } from '@/components/filters/RealmsRarityFilter';
import { ResourcesFilter } from '@/components/filters/ResourcesFilter';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { TraitsFilter } from '@/components/filters/TraitsFilter';
import { useRealmContext } from '@/context/RealmContext';

export function RealmsFilter() {
  const { state, actions } = useRealmContext();

  return (
    <div className="flex justify-between flex-wrap mb-2">
      <div className="w-full sm:w-auto my-1">
        <SearchFilter
          placeholder="SEARCH BY ID"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <div className="flex flex-wrap">
        <ResourcesFilter
          selectedValues={state.selectedResources}
          onChange={actions.updateSelectedResources}
        />
        <RealmsRarityFilter
          rarity={state.rarityFilter}
          onChange={actions.updateRarityFilter}
        />
        <OrdersFilter
          selectedValues={state.selectedOrders}
          onChange={actions.updateSelectedOrders}
        />
        <TraitsFilter
          traits={state.traitsFilter}
          onChange={actions.updateTraitsFilter}
        />
      </div>
    </div>
  );
}
