import { useMemo } from 'react';
import { useLootContext } from '@/context/LootContext';
import { BaseTabPanel } from '../BaseTabPanel';
import { AllLoot } from './AllLoot';
import { FavouriteLoot } from './FavouriteLoot';
import { YourLoot } from './YourLoot';

export const LootPanel = () => {
  const lootCtx = useLootContext();

  const tabs = useMemo(
    () => [
      {
        label: 'Your Loot',
        icon: <div />,
        component: <YourLoot />,
      },
      {
        label: 'All Loot',
        icon: <div />,
        component: <AllLoot />,
      },
      {
        label: 'Favourite Loot',
        icon: <div />,
        component: <FavouriteLoot />,
      },
    ],
    []
  );
  return (
    <BaseTabPanel
      panelName="Loot"
      panelType="loot"
      tabs={tabs}
      selectedIndex={lootCtx.state.selectedTab}
      onChange={lootCtx.actions.updateSelectedTab}
    />
  );
};
