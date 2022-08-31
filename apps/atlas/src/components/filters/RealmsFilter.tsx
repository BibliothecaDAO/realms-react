import { Button } from '@bibliotheca-dao/ui-lib';
import { OrdersFilter } from '@/components/filters/OrdersFilter';
import { RealmsRarityFilter } from '@/components/filters/RealmsRarityFilter';
import { ResourcesFilter } from '@/components/filters/ResourcesFilter';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { TraitsFilter } from '@/components/filters/TraitsFilter';
import { useRealmContext } from '@/context/RealmContext';
import { BaseFilter } from './BaseFilter';

type RealmsFilterProps = {
  isYourRealms: boolean;
};

export function RealmsFilter(props: RealmsFilterProps) {
  const { state, actions } = useRealmContext();

  return (
    <BaseFilter>
      <div>
        <Button
          variant={state.isRaidableFilter ? 'primary' : 'outline'}
          size="xs"
          onClick={actions.toggleIsRaidableFilter}
        >
          Raidable
        </Button>
      </div>
      <div>
        <Button
          variant={state.isSettledFilter ? 'primary' : 'outline'}
          size="xs"
          onClick={actions.toggleIsSettledFilter}
        >
          Settled
        </Button>
      </div>
      <div>
        <Button
          variant={state.hasWonderFilter ? 'primary' : 'outline'}
          size="xs"
          onClick={actions.toggleHasWonderFilter}
        >
          Wonder
        </Button>
      </div>

      <ResourcesFilter
        selectedValues={state.selectedResources}
        onChange={actions.updateSelectedResources}
      />
      <OrdersFilter
        selectedValues={state.selectedOrders}
        onChange={actions.updateSelectedOrders}
      />
      <RealmsRarityFilter
        rarity={state.rarityFilter}
        onChange={actions.updateRarityFilter}
      />
      <TraitsFilter
        traits={state.traitsFilter}
        onChange={actions.updateTraitsFilter}
      />

      <div className="md:ml-4">
        <Button variant="outline" size="xs" onClick={actions.clearFilters}>
          Clear <span className="hidden md:block ml-2">Filters</span>
        </Button>
      </div>
    </BaseFilter>
  );
}
