import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useCryptContext } from '@/context/CryptContext';
import { CryptEnvironmentFilter } from './CryptEnvironmentFilter';
import { CryptStatsFilter } from './CryptStatsFilter';
import { SearchFilter } from './SearchFilter';

export function CryptFilter() {
  const { state, actions } = useCryptContext();

  return (
    <div className="flex justify-between">
      <div>
        <SearchFilter
          placeholder="SEARCH BY ID"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <div className="flex mb-4">
        <CryptEnvironmentFilter
          selectedValues={state.environmentsFilter}
          onChange={actions.updateEnvironmentsFilter}
        />
        <CryptStatsFilter
          stats={state.statsFilter}
          onChange={actions.updateStatsFilter}
        />
      </div>
    </div>
  );
}
