import { Button } from '@bibliotheca-dao/ui-lib';
import { OrdersFilter } from '@/components/filters/OrdersFilter';
import { RealmsRarityFilter } from '@/components/filters/RealmsRarityFilter';
import { ResourcesFilter } from '@/components/filters/ResourcesFilter';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { TraitsFilter } from '@/components/filters/TraitsFilter';
import { useRealmContext } from '@/context/RealmContext';

type RealmsFilterProps = {
  isYourRealms: boolean;
};

export function RealmsFilter(props: RealmsFilterProps) {
  const { state, actions } = useRealmContext();

  return (
    <div>
      <div className="flex flex-wrap justify-between px-2 py-2 bg-black">
        <div className="flex flex-wrap self-center gap-2 md:flex-nowrap">
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
        </div>
      </div>
    </div>
  );
}
