import { OrderIcon, Tabs } from '@bibliotheca-dao/ui-lib/base';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import Shield from '@bibliotheca-dao/ui-lib/icons/shield.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/sword.svg';
import clsx from 'clsx';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { AttackingArmy } from '@/components/realms//details/AttackingArmy';
import { BuildingUtilisation } from '@/components/realms//details/BuildingUtilisation';
import { DetailedOverview } from '@/components/realms//details/DetailedOverview';
import { LaborTable } from '@/components/realms//details/LaborTable';
import { RealmLore } from '@/components/realms/details';
import { DefendingArmy } from '@/components/realms/details/DefendingArmy';
import { MilitaryBuildings } from '@/components/realms/details/MilitaryBuildings';
import {
  getAttackingArmyImage,
  getDefendingArmyImage,
  getHappinessImage,
  getMilitaryImage,
  getMilitaryBuildingsBuilt,
  getStoreHouseSize,
} from '@/components/realms/RealmsGetters';

import type { RealmFragmentFragment } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { useProjectedBuildingSpace } from '@/hooks/settling/useProjectedBuildingSpace';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useRealmDetailHotkeys, {
  HotKeys,
} from '@/hooks/settling/useRealmDetailHotkeys';
import useKeyPress from '@/hooks/useKeyPress';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import type { BuildingDetail, BuildingFootprint } from '@/types/index';
import { realmMilitaryEvents } from '@/types/index';

type Prop = {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
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

export const RealmModal = (props: Prop) => {
  const { realm, buildings, availableFood, buildingUtilisation, next, prev } =
    props;
  const { data: historyData, loading: loadingHistory } =
    useGetRealmHistoryQuery({
      variables: { filter: { realmId: { equals: realm.realmId } } },
      pollInterval: 30000,
    });
  const { play } = useUiSounds(soundSelector.pageTurn);
  const { subview, set } = useRealmDetailHotkeys(
    router.query['tab'] as Subview
  );
  const [imgSrc, setImgSrc] = useState<string>(
    getHappinessImage({
      realm: props.realm,
      food: props.availableFood,
    })
  );
  const realmDefendEventData = historyData?.getRealmHistory.filter(
    (event) => event.eventType == realmMilitaryEvents.realmCombatDefend
  );
  const realmAttackEventData = historyData?.getRealmHistory.filter(
    (event) => event.eventType == realmMilitaryEvents.realmCombatAttack
  );
  const leftPressed = useKeyPress({ keycode: 'LEFT' });
  const rightPressed = useKeyPress({ keycode: 'RIGHT' });
  const defendingArmyImage = getDefendingArmyImage(realm);
  const attackingArmyImage = getAttackingArmyImage(realm);

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
            <Map className="self-center w-4 h-4 fill-current" />
          </span>
        ),
        component: (
          <DetailedOverview
            buildingUtilisation={buildingUtilisation}
            availableFood={availableFood}
            realm={realm}
            loading={false}
            defendHistory={realmDefendEventData}
          />
        ),
        imgSrc: getHappinessImage({
          realm: props.realm,
          food: props.availableFood,
        }),
      },
      {
        hotkey: HotKeys.MilitaryBuildings,
        label: (
          <span className="flex">
            <Castle className="self-center w-4 h-4 fill-current" />
          </span>
        ),
        component: <MilitaryBuildings buildings={buildings} realm={realm} />,
        imgSrc: getMilitaryImage(buildings),
      },
      {
        hotkey: HotKeys.DefendingArmy,
        label: (
          <span className="flex">
            <Shield className="self-center w-4 h-4 fill-current" />
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
        imgSrc: defendingArmyImage,
      },
      {
        hotkey: HotKeys.AttackingArmy,
        label: (
          <span className="flex">
            <Sword className="self-center w-4 h-4 fill-current" />
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
        imgSrc: attackingArmyImage,
      },
      {
        hotkey: HotKeys.FoodResources,
        label: (
          <span className="flex">
            <Sickle className="self-center w-4 h-4 fill-current" />
          </span>
        ),
        component: (
          <>
            {realm.resources?.map((resource) => (
              <LaborTable
                key={resource.resourceId}
                resourceId={resource.resourceId}
                realmsResources={[realm]}
              />
            ))}
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
    [
      realm,
      buildings,
      availableFood,
      historyData,
      attackingArmyImage,
      defendingArmyImage,
    ]
  );

  const pressedTab = (index) => {
    play();
    set(Object.keys(HotKeys)[index as number] as Subview);
    if (tabs[index].imgSrc != undefined) {
      setImgSrc(tabs[index].imgSrc as string);
    }
  };

  const { buildingSpaceEnqueued, storehouseSpaceEnqueued } =
    useProjectedBuildingSpace(realm);

  return (
    <div className="flex flex-wrap">
      <div className="relative flex flex-wrap w-full min-h-max">
        <div className="w-1/5 lg:w-1/3">
          <Image
            src={imgSrc}
            width={1024}
            height={1536}
            alt=""
            className="sticky top-0 object-cover w-full -translate-y-8 rounded-br-full"
          />
        </div>
        <div className="w-4/5 h-full px-4 mx-auto overflow-y-scroll lg:w-2/3 lg:px-10 rounded-2xl">
          <div className="relative w-full text-center rounded">
            <div className="flex justify-center w-full py-3 text-center ">
              <div className="self-center">
                <OrderIcon
                  withTooltip
                  size="lg"
                  className="self-center"
                  order={realm.orderType.toLowerCase()}
                />
              </div>

              <h1 className="ml-3">{realm.name}</h1>
            </div>
          </div>

          <Tabs
            selectedIndex={Object.keys(HotKeys).indexOf(subview || 'Overview')}
            onChange={(index) => pressedTab(index as number)}
            variant="primary"
          >
            <Tabs.List className="">
              {tabs.map((tab, index) => (
                <Tabs.Tab key={index} noText={true}>
                  {tab.label}
                  {/* <RealmBuildTabHotkey hotkey={tab.hotkey} /> */}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <BuildingUtilisation
              totalSpace={buildingUtilisation?.maxSqm}
              buildings={buildingUtilisation?.currentSqm}
              storehouse={getStoreHouseSize(availableFood)}
              projectedStorehouseSpace={storehouseSpaceEnqueued}
              projectedBuildingSpace={buildingSpaceEnqueued}
            />

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
