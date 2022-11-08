import { Button } from '@bibliotheca-dao/ui-lib';
import { useCryptContext } from '@/context/CryptContext';
import { BaseFilter } from './BaseFilter';
import { CryptEnvironmentFilter } from './CryptEnvironmentFilter';
import { CryptStatsFilter } from './CryptStatsFilter';

export function CryptFilter() {
  const { state, actions } = useCryptContext();

  return (
    <BaseFilter>
      <div>
        <Button
          variant={state.isLegendaryFilter ? 'primary' : 'outline'}
          size="xs"
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
