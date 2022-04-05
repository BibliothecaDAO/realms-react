import { Tabs } from '@bibliotheca-dao/ui-lib';
import { useMemo } from 'react';
import { BaseTabPanel } from '../BaseTabPanel';
import { AllGa } from './AllGa';
import { FavouriteGa } from './FavouriteGa';
import { YourGa } from './YourGa';

export const GaPanel = () => {
  const tabs = useMemo(
    () => [
      {
        label: 'Your GA',
        icon: <div />,
        component: <YourGa />,
      },
      {
        label: 'All GA',
        icon: <div />,
        component: <AllGa />,
      },
      {
        label: 'Favourite Loot',
        icon: <div />,
        component: <FavouriteGa />,
      },
    ],
    []
  );
  return (
    <BaseTabPanel panelName="Genesis Adventurer" panelType="ga" tabs={tabs} />
  );
};
