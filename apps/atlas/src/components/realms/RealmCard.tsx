import { OrderIcon, Button, Card, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import { HeartIcon } from '@heroicons/react/20/solid';
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
import { RealmOverview, Travel } from '@/components/realms/details';
import {
  isFavourite,
  IsSettled,
  isYourRealm,
  getRealmCombatStatus,
  RealmOwner,
  getHappinessIcon,
  getNumberOfTicks,
  getTimeUntilNextTick,
  getVaultRaidableLaborUnits,
  getIsRealmAnnexed,
  filterFoodResources,
  checkIsRaidable,
} from '@/components/realms/RealmsGetters';
import SidebarHeader from '@/components/ui/sidebar/SidebarHeader';
import {
  FISH_ID,
  HarvestType,
  RealmBuildingId,
  WHEAT_ID,
} from '@/constants/globals';
import { findResourceById } from '@/constants/resources';
import { sidebarClassNames } from '@/constants/ui';
import { useAtlasContext } from '@/context/AtlasContext';
import { useModalContext } from '@/context/ModalContext';
import { useRealmContext } from '@/context/RealmContext';
import type { Realm } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useBuildings from '@/hooks/settling/useBuildings';
import { useCurrentQueuedTxs } from '@/hooks/settling/useCurrentQueuedTxs';
import useFood, { Entrypoints } from '@/hooks/settling/useFood';
import { usePendingRealmTx } from '@/hooks/settling/usePendingRealmTx';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import useIsOwner from '@/hooks/useIsOwner';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import type { RealmsCardProps } from '@/types/index';
import { shortenAddressWidth } from '@/util/formatters';
import { getArmyById, GetArmyStrength } from '../armies/ArmyGetters';
import { ArmyToolTip } from '../armies/ArmyToolTip';
import { RealmsDetailSideBar } from './RealmsDetailsSideBar';

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

    const { buildings, buildingUtilisation } = useBuildings(realm as Realm);

    const { realmFoodDetails, availableFood, harvest } = useFood(
      realm as Realm
    );

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
    const [isDetails, setDetails] = useState(false);

    const [isRaiding, setIsRaiding] = useState(false);
    const [isTravel, setIsTravel] = useState(false);

    const {
      mapContext: { navigateToAsset },
    } = useAtlasContext();

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
        <div className="flex w-full">
          <div className="flex self-center justify-between w-full pb-2 border-b border-white/30">
            <div>
              <h3 className="flex">
                {realm.name} | <span className="px-2">{realm.realmId} </span>
              </h3>
            </div>
            <div className="self-center">
              <ArmyToolTip army={getArmyById(0, realm)} />
            </div>

            <OrderIcon
              className="self-center"
              size="md"
              order={realm.orderType.toLowerCase()}
            />
          </div>
        </div>
        <div className="flex w-full mt-1">
          <div className="w-full">
            <div className="flex w-full my-3 space-x-2">
              {filterFoodResources(realm.resources).map((resource, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center text-center"
                >
                  <ResourceIcon
                    withTooltip
                    resource={
                      findResourceById(resource.resourceId)?.trait.replace(
                        ' ',
                        ''
                      ) || ''
                    }
                    size="xs"
                  />
                  <span className="font-semibold">
                    {' '}
                    {getVaultRaidableLaborUnits(
                      resource.labor?.vaultBalance
                    ).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap w-full space-x-1">
              {IsSettled(realm) && (
                <>
                  {isOwner && (
                    <>
                      <Button
                        onClick={() => setDetails(!isDetails)}
                        variant="outline"
                        size="xs"
                      >
                        construct
                      </Button>
                    </>
                  )}
                </>
              )}

              {realm && !isOwner && IsSettled(realm) && (
                <div className="flex space-x-1">
                  {userArmiesAtLocation && userArmiesAtLocation.length ? (
                    <Button
                      onClick={() => {
                        setIsRaiding(true);
                      }}
                      size="sm"
                      // disabled={checkIsRaidable(realm)}
                      variant={checkIsRaidable(realm) ? 'primary' : 'outline'}
                    >
                      {realm && getRealmCombatStatus(realm)}
                    </Button>
                  ) : (
                    ''
                  )}

                  <Button
                    onClick={() => {
                      setIsTravel(true);
                    }}
                    size="sm"
                    variant={'outline'}
                  >
                    travel to raid
                  </Button>
                </div>
              )}

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

            <div className="flex justify-between w-full pt-3 mt-3 text-sm border-t border-white/20">
              <span className="self-center">
                <span className="flex mr-2">
                  <Tooltip
                    placement="bottom"
                    className="z-10 flex self-center"
                    tooltipText={
                      <div className="p-2 text-sm rounded bg-gray-1000 whitespace-nowrap">
                        You must keep your Realm happy to keep it from
                        revolting...
                      </div>
                    }
                  >
                    {getHappinessIcon({
                      realm: realm,
                      food: availableFood,
                    })}
                  </Tooltip>{' '}
                </span>
              </span>
              <div className="self-center mr-2">
                {!isFavourite(realm, favouriteRealms) ? (
                  <Button
                    size="xs"
                    variant="unstyled"
                    onClick={() => actions.addFavouriteRealm(realm.realmId)}
                  >
                    <HeartIcon className="w-5 fill-gray-1000 stroke-yellow-800 hover:fill-current" />
                  </Button>
                ) : (
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
              <div>
                <Tooltip
                  placement="bottom"
                  className="z-10 flex self-center"
                  tooltipText={
                    <div className="p-4 text-sm rounded w-72 bg-gray-1000">
                      Eternum works on a 12hr Cycle. Every 12hrs the game ticks
                      over. There are consequences for not maintaining happy
                      Realms which occur after a tick.
                    </div>
                  }
                >
                  <h6 className="text-gray-700">
                    ({getNumberOfTicks(realm)} ticks) |{' '}
                    {getTimeUntilNextTick(realm)} hrs
                  </h6>
                </Tooltip>{' '}
              </div>

              <div className="flex ml-auto">
                <Tooltip
                  placement="bottom"
                  className="z-10 flex self-center ml-auto"
                  tooltipText={
                    <div className="p-4 text-sm rounded w-72 bg-gray-1000">
                      This Realm is holding {realm.relicsOwned?.length} Relics!
                      <br />
                      Annexed: The Realm has lost its Relic.
                      <br /> Self Sovereign: The Realm has its Relic.
                    </div>
                  }
                >
                  <div className="flex">
                    <span
                      className={`self-center text-xs  uppercase ${
                        getIsRealmAnnexed(realm)
                          ? 'text-green-700'
                          : 'text-red-400'
                      }`}
                    >
                      {getIsRealmAnnexed(realm) ? 'self sovereign ' : 'annexed'}
                    </span>
                    <span className="mx-2">{realm.relicsOwned?.length}</span>{' '}
                    <Relic className={`w-3 fill-yellow-500`} />{' '}
                  </div>
                </Tooltip>{' '}
              </div>
              {enqueuedTx ? (
                <span className="self-center w-3 h-3 ml-2 bg-green-900 border border-green-500 rounded-full animate-pulse"></span>
              ) : (
                ''
              )}
              <div className="flex flex-col justify-end mb-1 ml-auto text-gray-500">
                <div className="flex self-end">
                  <span>
                    {' '}
                    {starknetId ?? starknetId}
                    {!starknetId && shortenAddressWidth(RealmOwner(realm), 6)}
                    {!starknetId &&
                      isYourRealm(realm, l1Address, address || '') &&
                      isYourRealm(realm, l1Address, address || '')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AtlasSidebar containerClassName="w-full z-40" isOpen={isRaiding}>
          {isRaiding && (
            <CombatSideBar
              onClose={() => setIsRaiding(false)}
              defendingRealm={realm}
            />
          )}
        </AtlasSidebar>

        <AtlasSidebar
          containerClassName={sidebarClassNames.replace('z-30', 'z-100')}
          isOpen={isTravel}
        >
          {isTravel && (
            <>
              <SidebarHeader onClose={() => setIsTravel(false)} />
              <Travel realm={realm} />
            </>
          )}
        </AtlasSidebar>

        {
          <RealmsDetailSideBar
            isOpen={isDetails}
            onClose={() => setDetails(false)}
            realm={realm}
            buildings={buildings}
            realmFoodDetails={realmFoodDetails}
            availableFood={availableFood}
            buildingUtilisation={buildingUtilisation}
          />
        }
      </Card>
    );
  }
);

RealmCard.displayName = 'RealmCard';
