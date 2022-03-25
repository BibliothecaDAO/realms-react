import { Tabs } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { animated, useSpring } from '@react-spring/web';
import { useState, useMemo } from 'react';
import { RealmCard } from '@/components/cards/RealmCard';
import { RealmsEmpire } from '@/components/map/RealmsEmpire';
import { RealmOverview } from '@/components/tables/RealmOverview';
import { useUIContext } from '@/hooks/useUIContext';
import { BasePanel } from './BasePanel';

export const RealmsPanel = () => {
  const { togglePanelType, selectedPanel } = useUIContext();

  const tabs = useMemo(
    () => [
      {
        label: 'Your Realms',
        icon: <Castle className="mr-2" />,
        component: <RealmOverview />,
      },
      {
        label: 'All Realms',
        icon: <Danger className="mr-2" />,
        component: <RealmOverview />,
      },
      {
        label: 'Favourite Realms',
        icon: <Danger className="mr-2" />,
        component: <Castle className="w-48 h-48 fill-black" />,
      },
    ],
    []
  );
  return (
    <BasePanel open={selectedPanel === 'realm'}>
      <div className="flex justify-between">
        <h1 className="tex">Realms</h1>
        <button
          className="p-4 mb-8 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={() => togglePanelType('realm')}
        >
          CLOSE
        </button>
      </div>
      <Tabs>
        <Tabs.List className="ml-8">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.label} className="uppercase">
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels className="mt-8">
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </BasePanel>
  );
};
