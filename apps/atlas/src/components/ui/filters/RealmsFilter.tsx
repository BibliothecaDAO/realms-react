import { Button } from '@bibliotheca-dao/ui-lib';
import { RelicFilter } from '@/components/ui/filters//RelicFilter';
import { BaseFilter } from '@/components/ui/filters/BaseFilter';
import { OrdersFilter } from '@/components/ui/filters/OrdersFilter';
import { RealmsRarityFilter } from '@/components/ui/filters/RealmsRarityFilter';
import { ResourcesFilter } from '@/components/ui/filters/ResourcesFilter';
import { TraitsFilter } from '@/components/ui/filters/TraitsFilter';
import { useRealmContext } from '@/context/RealmContext';
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
      <RelicFilter
        relic={state.relicFilter}
        onChange={actions.updateRelicFilter}
      />

      <div className="md:ml-1">
        <Button variant="secondary" size="xs" onClick={actions.clearFilters}>
          Clear
        </Button>
      </div>
    </BaseFilter>
  );
}
