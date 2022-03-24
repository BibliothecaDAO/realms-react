import { Tabs } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { animated, useSpring } from '@react-spring/web';
import { useState, useMemo } from 'react';
import { Realm } from '@/components/cards/Realm';
import { RealmsEmpire } from '@/components/map/RealmsEmpire';
import { RealmOverview } from '@/components/tables/RealmOverview';
import { useUIContext } from '@/hooks/useUIContext';

export const RealmsPanel = () => {
  const { togglePanelType, selectedPanel } = useUIContext();

  const isEmpireMenu = selectedPanel === 'realm';
  const animation = useSpring({
    opacity: isEmpireMenu ? 1 : 0,
    transform: isEmpireMenu ? `translateY(0)` : `translateY(-200%)`,
    delay: 200,
  });
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
        component: <Helm className="w-48 h-48 fill-black" />,
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
    <animated.div
      className="absolute top-0 z-30 w-full h-screen bg-center bg-cover"
      style={animation}
    >
      <div className={`h-screen w-7/12 relative top-0 p-6 rounded-r-2xl`}>
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
      </div>
    </animated.div>
  );
};
