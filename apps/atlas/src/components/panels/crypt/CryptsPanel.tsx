import { useMemo } from 'react';
import { useCryptContext } from '@/context/CryptContext';
import { BaseTabPanel } from '../BaseTabPanel';
import { AllCrypts } from './AllCrypts';
import { FavouriteCrypts } from './FavouriteCrypts';
import { YourCrypts } from './YourCrypts';

export const CryptsPanel = () => {
  const gaCtx = useCryptContext();

  const tabs = useMemo(
    () => [
      {
        label: 'Your Crypts',
        icon: <div />,
        component: <YourCrypts />,
      },
      {
        label: 'All Crypts',
        icon: <div />,
        component: <AllCrypts />,
      },
      {
        label: 'Favourite Crypts',
        icon: <div />,
        component: <FavouriteCrypts />,
      },
    ],
    []
  );
  return (
    <BaseTabPanel
      panelName="Crypts"
      panelType="crypt"
      tabs={tabs}
      selectedIndex={gaCtx.state.selectedTab}
      onChange={gaCtx.actions.updateSelectedTab}
    />
  );
};
