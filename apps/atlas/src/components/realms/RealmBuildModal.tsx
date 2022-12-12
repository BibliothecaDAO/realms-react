import { OrderIcon, Tabs } from '@bibliotheca-dao/ui-lib/base';

import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import Scroll from '@bibliotheca-dao/ui-lib/icons/scroll-svgrepo-com.svg';
import Shield from '@bibliotheca-dao/ui-lib/icons/shield.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/sword.svg';

import { useMemo, useState } from 'react';
import {
  RealmHistory,
  RealmLore,
  RealmOverview,
  RealmsFood,
  Travel,
  WorkHuts,
} from '@/components/realms/details';
import { DefendingArmy } from '@/components/realms/details/DefendingArmy';
import { MilitaryBuildings } from '@/components/realms/details/MilitaryBuildings';
import {
  getMilitaryBuildingsBuilt,
  getNumberOfTicks,
  getTimeSinceLastTick,
} from '@/components/realms/RealmsGetters';
import { HAPPINESS_TIME_PERIOD_TICK } from '@/constants/buildings';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import type {
  BuildingDetail,
  BuildingFootprint,
  RealmFoodDetails,
} from '@/types/index';
import { realmMilitaryEvents } from '@/types/index';
import { AttackingArmy } from './details/AttackingArmy';
import { DetailedOverview } from './details/DetailedOverview';

type Prop = {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  buildingUtilisation: BuildingFootprint | undefined;
};

export const RealmBuildModal = (props: Prop) => {
  const {
    realm,
    buildings,
    realmFoodDetails,
    availableFood,
    buildingUtilisation,
  } = props;
  const { data: historyData, loading: loadingData } = useGetRealmHistoryQuery({
    variables: { filter: { realmId: { equals: realm.realmId } } },
    pollInterval: 30000,
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const { play } = useUiSounds(soundSelector.pageTurn);

  const realmDefendEventData = historyData?.getRealmHistory.filter(
    (event) => event.eventType == realmMilitaryEvents.realmCombatDefend
  );
  const realmAttackEventData = historyData?.getRealmHistory.filter(
    (event) => event.eventType == realmMilitaryEvents.realmCombatAttack
  );

  const tabs = useMemo(
    () => [
      {
        label: (
          <span className="flex">
            <Map className="self-center w-4 h-4 mr-2 fill-current" />
          </span>
        ),
        component: (
          <DetailedOverview
            buildingUtilisation={buildingUtilisation}
            availableFood={availableFood}
            realmFoodDetails={realmFoodDetails}
            realm={realm}
            loading={false}
            defendHistory={realmDefendEventData}
          />
        ),
      },
      {
        label: (
          <span className="flex">
            <Castle className="self-center w-4 h-4 mr-2 fill-current" />
          </span>
        ),
        component: <MilitaryBuildings buildings={buildings} realm={realm} />,
      },
      {
        label: (
          <span className="flex">
            <Shield className="self-center w-4 h-4 mr-2 fill-current" />
          </span>
        ),
        component: (
          <DefendingArmy
            realm={realm}
            buildings={getMilitaryBuildingsBuilt(buildings)}
            availableFood={availableFood}
            defendHistory={realmDefendEventData}
          />
        ),
      },
      {
        label: (
          <span className="flex">
            <Sword className="self-center w-4 h-4 mr-2 fill-current" />
          </span>
        ),
        component: (
          <AttackingArmy
            realm={realm}
            buildings={getMilitaryBuildingsBuilt(buildings)}
            availableFood={availableFood}
            attackHistory={realmAttackEventData}
          />
        ),
      },
      /* {
        label: (
          <span className="flex">
            <Sickle className="self-center w-4 h-4 mr-2 fill-current" />{' '}
          </span>
        ),
        component: <WorkHuts buildings={buildings} realm={realm} />,
      }, */
      {
        label: (
          <span className="flex">
            <Sickle className="self-center w-4 h-4 mr-2 fill-current" />
          </span>
        ),
        component: (
          <>
            <div className="mb-12">
              <WorkHuts buildings={buildings} realm={realm} />
            </div>
            <RealmsFood
              realmFoodDetails={realmFoodDetails}
              availableFood={availableFood}
              buildings={buildings}
              realm={realm}
              loading={false}
            />
          </>
        ),
      },
      // {
      //   label: <Globe className="self-center w-4 h-4 fill-current" />,
      //   component: <Travel realm={realm} />,
      // },
      // {
      //   label: <Scroll className="self-center w-4 h-4 fill-current" />,
      //   component: <RealmHistory realmId={realm.realmId} />,
      // },
      {
        label: <Library className="self-center w-4 h-4 fill-current" />,
        component: (
          <RealmLore
            realmName={realm.name || ''}
            realmId={realm.realmId || 0}
          />
        ),
      },
    ],
    [realm, buildings, availableFood, realmFoodDetails, historyData]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <div className="flex-col flex-wrap px-4 bg-gray/800">
      <div className="flex flex-wrap self-center justify-center mb-4">
        <div className="flex justify-center w-full">
          <h6 className="animate-pulse">
            ({getNumberOfTicks(realm)} cycles) | {getTimeSinceLastTick(realm)}{' '}
            hrs since update
          </h6>
        </div>
        <div className="flex justify-center w-full">
          <OrderIcon size="lg" order={realm.orderType.toLowerCase()} />
          <h1 className="flex self-center ml-2 text-center">{realm.name}</h1>
        </div>
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
