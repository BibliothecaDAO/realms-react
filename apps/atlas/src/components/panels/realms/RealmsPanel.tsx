import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import { useMemo } from 'react';
import { useRealmContext } from '@/context/RealmContext';
import { BaseTabPanel } from '../BaseTabPanel';
import { AllRealms } from './AllRealms';
import { FavouriteRealms } from './FavouriteRealms';
import { YourRealms } from './YourRealms';

export const RealmsPanel = () => {
  const realmsCtx = useRealmContext();
  const tabs = useMemo(
    () => [
      {
        label: 'Your Realms',
        icon: <Castle className="mr-2" />,
        component: <YourRealms />,
      },
      {
        label: 'All Realms',
        icon: <Danger className="mr-2" />,
        component: <AllRealms />,
      },
      {
        label: 'Favourite Realms',
        icon: <Danger className="mr-2" />,
        component: <FavouriteRealms />,
      },
    ],
    []
  );
  return (
    <BaseTabPanel
      panelName="Realms"
      panelType="realm"
      tabs={tabs}
      selectedIndex={realmsCtx.state.selectedTab}
      onChange={realmsCtx.actions.updateSelectedTab}
    />
  );
};
