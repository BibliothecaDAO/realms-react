import { OrderIcon, Tabs } from '@bibliotheca-dao/ui-lib/base';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Shield from '@bibliotheca-dao/ui-lib/icons/shield.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/sword.svg';

import { useMemo, useState } from 'react';
import { RealmsFood, WorkHuts } from '@/components/realms/details';
import { DefendingArmy } from '@/components/realms/details/DefendingArmy';
import { MilitaryBuildings } from '@/components/realms/details/MilitaryBuildings';
import { getMilitaryBuildingsBuilt } from '@/components/realms/RealmsGetters';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import type { BuildingDetail, RealmFoodDetails } from '@/types/index';
import { AttackingArmy } from './details/AttackingArmy';

type Prop = {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
};

export const RealmBuildModal = (props: Prop) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { play } = useUiSounds(soundSelector.pageTurn);

  const tabs = useMemo(
    () => [
      {
        label: (
          <span className="flex">
            <Sword className="self-center w-4 h-4 mr-2 fill-current" />
            Military
          </span>
        ),
        component: (
          <MilitaryBuildings buildings={props.buildings} realm={props.realm} />
        ),
      },
      {
        label: (
          <span className="flex">
            <Shield className="self-center w-4 h-4 mr-2 fill-current" /> Defence
          </span>
        ),
        component: (
          <DefendingArmy
            realm={props.realm}
            buildings={getMilitaryBuildingsBuilt(props.buildings)}
            availableFood={props.availableFood}
          />
        ),
      },
      {
        label: (
          <span className="flex">
            <Shield className="self-center w-4 h-4 mr-2 fill-current" /> Offence
          </span>
        ),
        component: (
          <AttackingArmy
            realm={props.realm}
            buildings={getMilitaryBuildingsBuilt(props.buildings)}
            availableFood={props.availableFood}
          />
        ),
      },
      {
        label: (
          <span className="flex">
            <Sickle className="self-center w-4 h-4 mr-2 fill-current" />{' '}
            Production
          </span>
        ),
        component: <WorkHuts buildings={props.buildings} realm={props.realm} />,
      },
      {
        label: (
          <span className="flex">
            <Sickle className="self-center w-4 h-4 mr-2 fill-current" /> Farming
          </span>
        ),
        component: (
          <RealmsFood
            realmFoodDetails={props.realmFoodDetails}
            availableFood={props.availableFood}
            buildings={props.buildings}
            realm={props.realm}
            loading={false}
          />
        ),
      },
    ],
    [props.realm, props.buildings, props.availableFood, props.realmFoodDetails]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <div className="flex-col flex-wrap px-4 bg-gray/800">
      <div className="flex self-center justify-center mb-4">
        <OrderIcon size="lg" order={props.realm.orderType.toLowerCase()} />
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

        <Tabs.Panels className="pb-20">
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </div>
  );
};
