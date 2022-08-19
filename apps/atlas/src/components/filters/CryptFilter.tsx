import { Button } from '@bibliotheca-dao/ui-lib';
import clsx from 'clsx';
import { useCryptContext } from '@/context/CryptContext';
import { BaseFilter } from './BaseFilter';
import { CryptEnvironmentFilter } from './CryptEnvironmentFilter';
import { CryptStatsFilter } from './CryptStatsFilter';
import { SearchFilter } from './SearchFilter';

export function CryptFilter() {
  const { state, actions } = useCryptContext();

  return (
    <BaseFilter>
      <div>
        <Button
          variant="primary"
          size="sm"
          className={clsx(state.isLegendaryFilter ? 'bg-black' : '')}
          onClick={actions.toggleIsLegendaryFilter}
        >
          Legendary
        </Button>
      </div>

      <CryptEnvironmentFilter
        selectedValues={state.environmentsFilter}
        onChange={actions.updateEnvironmentsFilter}
      />
      <CryptStatsFilter
        stats={state.statsFilter}
        onChange={actions.updateStatsFilter}
      />
    </BaseFilter>
  );
}
