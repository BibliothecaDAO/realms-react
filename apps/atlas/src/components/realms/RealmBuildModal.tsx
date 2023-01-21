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
import clsx from 'clsx';

import router from 'next/router';
import { useEffect, useMemo, useState } from 'react';
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
  getHappinessImage,
  getMilitaryBuildingsBuilt,
  getNumberOfTicks,
  getTimeSinceLastTick,
} from '@/components/realms/RealmsGetters';
import { HAPPINESS_TIME_PERIOD_TICK } from '@/constants/globals';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useRealmDetailHotkeys, {
  HotKeys,
} from '@/hooks/settling/useRealmDetailHotkeys';
import useKeyPress from '@/hooks/useKeyPress';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import type {
  BuildingDetail,
  BuildingFootprint,
  RealmFoodDetails,
} from '@/types/index';
import { realmMilitaryEvents } from '@/types/index';
import { AttackingArmy } from './details/AttackingArmy';
import { DetailedOverview } from './details/DetailedOverview';
import { LaborTable } from './details/LaborTable';

type Prop = {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  buildingUtilisation: BuildingFootprint | undefined;
  next?: () => void;
  prev?: () => void;
};

export const RealmBuildTabHotkey = (props) => {
  const pressed = useKeyPress({ key: props.hotkey });
  return (
    <span
      className={clsx(
        'text-sm px-1 transition-colors uppercase opacity-30 hidden xl:block',
        pressed && 'bg-white text-black'
      )}
    >
      {props.hotkey}
    </span>
  );
};

export const RealmBuildModal = (props: Prop) => {
  const {
    realm,
    buildings,
    realmFoodDetails,
    availableFood,
    buildingUtilisation,
    next,
    prev,
  } = props;
  const { data: historyData, loading: loadingData } = useGetRealmHistoryQuery({
    variables: { filter: { realmId: { equals: realm.realmId } } },
    pollInterval: 30000,
  });
  const { play } = useUiSounds(soundSelector.pageTurn);
  const { subview, set } = useRealmDetailHotkeys(
    router.query['tab'] as Subview
  );
  const realmDefendEventData = historyData?.getRealmHistory.filter(
    (event) => event.eventType == realmMilitaryEvents.realmCombatDefend
  );
  const realmAttackEventData = historyData?.getRealmHistory.filter(
    (event) => event.eventType == realmMilitaryEvents.realmCombatAttack
  );
  const leftPressed = useKeyPress({ keycode: 'LEFT' });
  const rightPressed = useKeyPress({ keycode: 'RIGHT' });

  useEffect(() => {
    if (leftPressed) {
      prev && prev();
    }
    if (rightPressed) {
      next && next();
    }
  }, [leftPressed, rightPressed]);

  const tabs = useMemo(
    () => [
      {
        hotkey: HotKeys.Overview,
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
        hotkey: HotKeys.MilitaryBuildings,
        label: (
          <span className="flex">
            <Castle className="self-center w-4 h-4 mr-2 fill-current" />
          </span>
        ),
        component: <MilitaryBuildings buildings={buildings} realm={realm} />,
      },
      {
        hotkey: HotKeys.DefendingArmy,
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
        hotkey: HotKeys.AttackingArmy,
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
        hotkey: HotKeys.FoodResources,
        label: (
          <span className="flex">
            <Sickle className="self-center w-4 h-4 mr-2 fill-current" />
          </span>
        ),
        component: (
          <>
            <div>
              <LaborTable realm={realm} />
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
        hotkey: HotKeys.Lore,
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
    set(Object.keys(HotKeys)[index as number] as Subview);
  };

  return (
    <div className="flex flex-wrap">
      <div className="flex flex-wrap w-full min-h-max">
        <div className="relative w-1/3 h-full">
          <div className="absolute w-full h-full rounded-br-2xl"></div>
          <img
            src={getHappinessImage({
              realm: props.realm,
              food: props.availableFood,
            })}
            alt=""
            className="object-cover w-full h-full rounded-br-full"
          />
        </div>
        <div className="w-2/3 h-full p-10 mx-auto overflow-y-scroll rounded-2xl">
          <div className="relative w-full text-center">
            <div className="flex justify-center w-full py-3 text-center ">
              <OrderIcon
                withTooltip
                size="lg"
                order={realm.orderType.toLowerCase()}
              />
              <h1 className="self-center ml-3">{realm.name}</h1>
            </div>
          </div>

          {/* <div className="flex justify-center w-full">
            <h6 className="">
              ({getNumberOfTicks(realm)} cycles) | {getTimeSinceLastTick(realm)}{' '}
              hrs since update
            </h6>
          </div> */}
          <Tabs
            selectedIndex={Object.keys(HotKeys).indexOf(subview || 'Overview')}
            onChange={(index) => pressedTab(index as number)}
            variant="small"
          >
            <Tabs.List className="">
              {tabs.map((tab, index) => (
                <Tabs.Tab key={index}>
                  {tab.label}
                  <RealmBuildTabHotkey hotkey={tab.hotkey} />
                </Tabs.Tab>
              ))}
            </Tabs.List>

            <Tabs.Panels>
              {tabs.map((tab, index) => (
                <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
              ))}
            </Tabs.Panels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
