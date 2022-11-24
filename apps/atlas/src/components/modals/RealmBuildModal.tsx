import {
  Button,
  Card,
  CountdownTimer,
  OrderIcon,
  Tabs,
} from '@bibliotheca-dao/ui-lib/base';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Shield from '@bibliotheca-dao/ui-lib/icons/shield.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/sword.svg';

import { useMemo, useState } from 'react';
import { MilitaryBuildings } from '@/components/panels/Realms/details/MilitaryBuildings';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import type { BuildingDetail } from '@/types/index';

type Prop = {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
};

export const RealmBuildModal = (props: Prop) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { play } = useUiSounds(soundSelector.pageTurn);

  const tabs = useMemo(
    () => [
      {
        label: <Sword className="self-center w-4 h-4 fill-current" />,
        component: <div>Attack</div>,
      },
      {
        label: <Shield className="self-center w-4 h-4 fill-current" />,
        component: <div>army</div>,
      },
      {
        label: <Castle className="self-center w-4 h-4 fill-current" />,
        component: (
          <MilitaryBuildings buildings={props.buildings} realm={props.realm} />
        ),
      },
      {
        label: <Sickle className="self-center w-4 h-4 fill-current" />,
        component: <div>army</div>,
      },
    ],
    [props.realm, props.buildings]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <div className="flex-col flex-wrap px-4 bg-gray/800">
      <div className="flex self-center ">
        <OrderIcon size="sm" order={props.realm.orderType.toLowerCase()} />
        <h1 className="flex self-center ml-2 text-center">
          {props.realm.name}
        </h1>
      </div>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="small"
      >
        <Tabs.List className="">
          {tabs.map((tab, index) => (
            <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panels>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </div>
  );
};
