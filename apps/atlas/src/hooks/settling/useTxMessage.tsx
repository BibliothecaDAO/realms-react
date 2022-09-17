import { ENQUEUED_STATUS } from '@/constants/index';
import type { RealmsTransaction, RealmsTransactionRender } from '@/types/index';
import { renderTransaction as renderAmmTxs } from '../useSwapResources';
import { renderTransaction as renderBuildingTxs } from './useBuildings';
import { renderTransaction as renderCombatTxs } from './useCombat';
import { renderTransaction as renderFoodTxs } from './useFood';
import { renderTransaction as renderResourceTxs } from './useResources';
import { renderTransaction as renderSettlingTxs } from './useSettling';
import { renderTransaction as renderTravelTxs } from './useTravel';

export function getTxRenderConfig(
  tx: RealmsTransaction
): RealmsTransactionRender {
  const isQueued = tx.status == ENQUEUED_STATUS;

  const render = {
    ...renderResourceTxs,
    ...renderBuildingTxs,
    ...renderFoodTxs,
    ...renderAmmTxs,
    ...renderCombatTxs,
    ...renderSettlingTxs,
    ...renderTravelTxs,
  };

  const metadata = tx.metadata;

  if (metadata.title && metadata.description) {
    return metadata;
  }

  const renderConfig =
    render[tx.metadata?.action] ||
    function (tx, ctx) {
      console.error('No render configuration', tx);
      throw new Error(
        'No render configuration defined for transaction metadata:',
        tx.metadata
      );
    };
  return renderConfig(tx, { isQueued });
}
