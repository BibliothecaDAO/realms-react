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
      <div className="flex flex-wrap justify-between py-2 bg-black sm:px-2">
        <div className="flex self-center w-full gap-2 px-2 overflow-scroll sm:flex-wrap md:flex-nowrap scrollbar-hide">
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
