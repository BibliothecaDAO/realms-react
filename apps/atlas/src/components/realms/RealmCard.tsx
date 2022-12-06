import useCountdown from '@bibliotheca-dao/core-lib/hooks/use-countdown';
import {
  OrderIcon,
  Tabs,
  Button,
  Card,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import Scroll from '@bibliotheca-dao/ui-lib/icons/scroll-svgrepo-com.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/sword.svg';
import { Disclosure } from '@headlessui/react';
import { HeartIcon, ChevronDoubleDownIcon } from '@heroicons/react/20/solid';
import { useAccount } from '@starknet-react/core';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
} from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { CombatSideBar } from '@/components/armies/CombatSideBar';
import AtlasSidebar from '@/components/map/AtlasSideBar';
import {
  RealmHistory,
  RealmOverview,
  Travel,
  RealmLore,
  RealmsFood,
  RealmsArmy,
} from '@/components/realms/details';
import { RealmImage } from '@/components/realms/details/Image';
import { RealmResources } from '@/components/realms/RealmResources';
import {
  hasOwnRelic,
  isFavourite,
  IsSettled,
  isYourRealm,
  getRealmCombatStatus,
  RealmOwner,
  RealmStatus,
  getIsRaidable,
  getHappiness,
  getHappinessIcon,
  getNumberOfTicks,
  getTimeSinceLastTick,
  getTimeUntilNextTick,
} from '@/components/realms/RealmsGetters';
import SidebarHeader from '@/components/ui/sidebar/SidebarHeader';
import { HarvestType, RealmBuildingId } from '@/constants/buildings';
import { findResourceById } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import { useModalContext } from '@/context/ModalContext';
import { useRealmContext } from '@/context/RealmContext';
import type { GetRealmQuery, Realm } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useBuildings from '@/hooks/settling/useBuildings';
import { useCurrentQueuedTxs } from '@/hooks/settling/useCurrentQueuedTxs';
import useFood, { Entrypoints } from '@/hooks/settling/useFood';
import { usePendingRealmTx } from '@/hooks/settling/usePendingRealmTx';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import useIsOwner from '@/hooks/useIsOwner';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import type { RealmsCardProps } from '@/types/index';
import { shortenAddressWidth } from '@/util/formatters';

export const RealmCard = forwardRef<any, RealmsCardProps>(
  (props: RealmsCardProps, ref) => {
    const { realm, ...rest } = props;
    const { play } = useUiSounds(soundSelector.pageTurn);
    const { address: l1Address } = useL1Account();
    const { address } = useAccount();

    const { enqueuedTx } = usePendingRealmTx({ realmId: realm.realmId });
    const {
      state: { favouriteRealms },
      actions,
    } = useRealmContext();

    const ensData = useEnsResolver(realm?.owner as string);

    const {
      buildings,
      buildingUtilisation,
      loading: loadingBuildings,
    } = useBuildings(realm as Realm);

    const {
      realmFoodDetails,
      availableFood,
      loading: loadingFood,
      harvest,
    } = useFood(realm as Realm);

    const tabs = useMemo(
      () => [
        {
          label: <Castle className="self-center w-4 h-4 fill-current" />,
          component: (
            <RealmOverview
              buildingUtilisation={buildingUtilisation}
              availableFood={availableFood}
              realmFoodDetails={realmFoodDetails}
              {...props}
            />
          ),
        },

        // {
        //   label: <Sword className="self-center w-4 h-4 fill-current" />,
        //   component: <RealmsArmy buildings={buildings} realm={realm} />,
        // },
        // {
        //   label: <Sickle className="self-center w-4 h-4 fill-current" />,
        //   component: (
        //     <RealmsFood
        //       realmFoodDetails={realmFoodDetails}
        //       availableFood={availableFood}
        //       buildings={buildings}
        //       realm={realm}
        //       loading={false}
        //     />
        //   ),
        // },
        // {
        //   label: <Globe className="self-center w-4 h-4 fill-current" />,
        //   component: <Travel realm={realm} />,
        // },
        // {
        //   label: <Scroll className="self-center w-4 h-4 fill-current" />,
        //   component: <RealmHistory realmId={realm.realmId} />,
        // },
        // {
        //   label: <Library className="self-center w-4 h-4 fill-current" />,
        //   component: (
        //     <RealmLore
        //       realmName={realm.name || ''}
        //       realmId={realm.realmId || 0}
        //     />
        //   ),
        // },
      ],
      [availableFood, buildings, realmFoodDetails, props, buildingUtilisation]
    );
    const { userData } = useUsersRealms();
    const [selectedTab, setSelectedTab] = useState(0);

    useImperativeHandle(ref, () => ({
      selectTab(index) {
        setSelectedTab(index);
      },
    }));

    const pressedTab = (index) => {
      play();
      setSelectedTab(index as number);
    };

    const { starknetId } = useStarkNetId(RealmOwner(realm) || '');

    const userArmiesAtLocation = userData.attackingArmies?.filter(
      (army) => army.destinationRealmId == realm.realmId
    );

    const [isRaiding, setIsRaiding] = useState(false);
    const [isTravel, setIsTravel] = useState(false);

    const {
      mapContext: { navigateToAsset },
    } = useAtlasContext();
    const { openModal } = useModalContext();

    const { enqueuedHarvestTx: harvestFarmEnqueuedHarvestTx } =
      useCurrentQueuedTxs({
        moduleAddr: ModuleAddr.Food,
        entryPoint: Entrypoints.harvest,
        realmId: realm?.realmId,
      });

    const isOwner = useIsOwner(realm?.settledOwner);
    return (
      <Card ref={ref}>
        {realm?.wonder && (
          <div className="w-full p-2 mb-2 text-2xl font-semibold text-center uppercase rounded shadow-inner bg-gray-1000 tracking-veryWide">
            {realm?.wonder}
          </div>
        )}

        <div className="flex pb-2">
          {/* <RealmImage id={realm.realmId} /> */}
          <div>
            <div className="flex self-center ">
              <OrderIcon size="sm" order={realm.orderType.toLowerCase()} />
              <h3 className="flex self-center ml-2 text-center">
                {realm.name}{' '}
                {enqueuedTx ? (
                  <span className="self-center w-3 h-3 ml-2 bg-green-900 border border-green-500 rounded-full animate-pulse"></span>
                ) : (
                  ''
                )}
              </h3>
            </div>
            <div className="flex mt-1">
              <div className="flex">
                {!isFavourite(realm, favouriteRealms) && (
                  <Button
                    size="xs"
                    variant="unstyled"
                    onClick={() => actions.addFavouriteRealm(realm.realmId)}
                  >
                    <HeartIcon className="w-5 fill-black stroke-white/50 hover:fill-current" />
                  </Button>
                )}{' '}
                {isFavourite(realm, favouriteRealms) && (
                  <Button
                    size="xs"
                    variant="unstyled"
                    className="w-full"
                    onClick={() => actions.removeFavouriteRealm(realm.realmId)}
                  >
                    <HeartIcon className="w-5" />
                  </Button>
                )}
              </div>
              <div className="self-center ml-2">
                <Button
                  onClick={() => {
                    navigateToAsset(realm.realmId, 'realm');
                  }}
                  variant="outline"
                  size="xs"
                >
                  fly
                </Button>
              </div>
              <span className="self-center ml-2 text-lg ">{realm.realmId}</span>
            </div>
          </div>

          <div className="justify-center ml-auto text-lg ">
            <div className="text-right">
              {starknetId ?? starknetId}
              {!starknetId && shortenAddressWidth(RealmOwner(realm), 6)}
              {!starknetId &&
                isYourRealm(realm, l1Address, address || '') &&
                isYourRealm(realm, l1Address, address || '')}
            </div>{' '}
            <div className="flex justify-end">
              <span
                className={`self-center mr-2 text-xs  uppercase ${
                  hasOwnRelic(realm) ? 'text-green-700' : 'text-red-400'
                }`}
              >
                {hasOwnRelic(realm) ? 'free realm' : 'annexed'}
              </span>
              <span className="mr-3">{realm.relicsOwned?.length}</span>{' '}
              <Relic className={`w-3 fill-yellow-500`} />{' '}
              <span>
                {/* {getHappiness({ realm: realm, food: availableFood })}{' '} */}
                <span className="ml-2">
                  {' '}
                  {getHappinessIcon({
                    realm: realm,
                    food: availableFood,
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between w-full">
          <div className="flex">
            {realm.resources?.map((re, index) => (
              <div key={index} className="flex flex-col justify-center p-2">
                <ResourceIcon
                  withTooltip
                  resource={
                    findResourceById(re.resourceId)?.trait.replace(' ', '') ||
                    ''
                  }
                  size="sm"
                />
              </div>
            ))}
          </div>

          {IsSettled(realm) && (
            <>
              {isOwner && (
                <div className="flex space-x-1">
                  <Button
                    onClick={() => {
                      openModal('realm-build', {
                        realm: realm,
                        buildings: buildings,
                        realmFoodDetails: realmFoodDetails,
                        availableFood: availableFood,
                        buildingUtilisation: buildingUtilisation,
                      });
                    }}
                    variant="primary"
                    size="xs"
                  >
                    construct
                  </Button>
                  <Button
                    onClick={() => {
                      if (realmFoodDetails.totalFarmHarvest > 0) {
                        harvest(
                          realm?.realmId,
                          HarvestType.Export,
                          RealmBuildingId.Farm
                        );
                      }
                      if (realmFoodDetails.totalVillageHarvest > 0) {
                        harvest(
                          realm?.realmId,
                          HarvestType.Export,
                          RealmBuildingId.FishingVillage
                        );
                      }
                    }}
                    variant="outline"
                    size="xs"
                    className={
                      (realmFoodDetails.totalFarmHarvest === 0 &&
                        realmFoodDetails.totalVillageHarvest === 0) ||
                      harvestFarmEnqueuedHarvestTx
                        ? ''
                        : 'bg-green-800 animate-pulse'
                    }
                    disabled={
                      (realmFoodDetails.totalFarmHarvest === 0 &&
                        realmFoodDetails.totalVillageHarvest === 0) ||
                      harvestFarmEnqueuedHarvestTx
                    }
                  >
                    <ResourceIcon resource={'Wheat'} size="xs" />{' '}
                    <ResourceIcon resource={'Fish'} size="xs" />
                  </Button>
                  {/* <Button
                    onClick={() => {
                      openModal('realm-build', {
                        realm: realm,
                        buildings: buildings,
                        realmFoodDetails: realmFoodDetails,
                        availableFood: availableFood,
                        buildingUtilisation: buildingUtilisation,
                      });
                    }}
                    variant="outline"
                    size="xs"
                  >
                    <ResourceIcon withTooltip resource={'Wood'} size="xs" />
                  </Button> */}
                </div>
              )}
            </>
          )}
          {realm && !isOwner && IsSettled(realm) && (
            <div className="">
              <Button
                onClick={() => {
                  userArmiesAtLocation && userArmiesAtLocation.length
                    ? setIsRaiding(true)
                    : setIsTravel(true);
                }}
                size="sm"
                className="w-full"
                disabled={getIsRaidable(realm)}
                variant={'primary'}
              >
                {realm && getRealmCombatStatus(realm)}
              </Button>
            </div>
          )}
        </div>

        <h6 className="text-gray-700">
          ({getNumberOfTicks(realm)} cycles) | {getTimeUntilNextTick(realm)} hrs
          until next cycle
        </h6>

        <AtlasSidebar containerClassName="w-full" isOpen={isRaiding}>
          <SidebarHeader onClose={() => setIsRaiding(false)} />
          <CombatSideBar defendingRealm={realm} />
        </AtlasSidebar>
        <AtlasSidebar containerClassName="w-full md:w-5/12" isOpen={isTravel}>
          <SidebarHeader onClose={() => setIsTravel(false)} />
          <Travel realm={realm} />
        </AtlasSidebar>

        {/* <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-1 mb-2 border rounded border-white/20 hover:bg-gray-900">
                    <ChevronDoubleDownIcon
                      className={`w-5 h-5 mx-auto ${
                        open ? 'rotate-180 transform' : ''
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-gray-500">
                    {open && (
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
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure> */}
      </Card>
    );
  }
);

RealmCard.displayName = 'RealmCard';
