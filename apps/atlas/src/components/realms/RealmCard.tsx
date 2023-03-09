import { OrderIcon, Button, Card, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import LordsIcon from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import { HeartIcon } from '@heroicons/react/20/solid';
import { useAccount } from '@starknet-react/core';
import React, { forwardRef, useMemo, useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { CombatSideBar } from '@/components/armies/CombatSideBar';
import AtlasSidebar from '@/components/map/AtlasSideBar';
import { Travel } from '@/components/realms/details';
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
import { findResourceById } from '@/constants/resources';
import { sidebarClassNames } from '@/constants/ui';
import { useAtlasContext } from '@/context/AtlasContext';
import { useRealmContext } from '@/context/RealmContext';
import type { Realm } from '@/generated/graphql';
import { useMarketRate } from '@/hooks/market/useMarketRate';
import useBuildings from '@/hooks/settling/useBuildings';
import useFood from '@/hooks/settling/useFood';
import { usePendingRealmTx } from '@/hooks/settling/usePendingRealmTx';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import useIsOwner from '@/hooks/useIsOwner';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import type { RealmsCardProps } from '@/types/index';
import { shortenAddressWidth } from '@/util/formatters';
import { getArmyById } from '../armies/ArmyGetters';
import { ArmyToolTip } from '../armies/ArmyToolTip';
import { RealmsDetailSideBar } from './RealmsDetailsSideBar';

export const RealmCard = forwardRef<any, RealmsCardProps>(
  (props: RealmsCardProps, ref) => {
    const { realm } = props;

    const [isDetails, setDetails] = useState(false);
    const [isRaiding, setIsRaiding] = useState(false);
    const [isTravel, setIsTravel] = useState(false);

    const {
      state: { favouriteRealms },
      actions,
    } = useRealmContext();
    const { enqueuedTx } = usePendingRealmTx({ realmId: realm.realmId });

    const { address: l1Address } = useL1Account();
    const { address } = useAccount();
    const { buildings, buildingUtilisation } = useBuildings(realm as Realm);
    const { availableFood } = useFood(realm as Realm);
    const { userData } = useUsersRealms();
    const { starknetId } = useStarkNetId(RealmOwner(realm) || '');
    const { getTotalLordsCost } = useMarketRate();

    const {
      mapContext: { navigateToAsset },
    } = useAtlasContext();

    const isOwner = useIsOwner(realm?.settledOwner);

    const userArmiesAtLocation = userData.attackingArmies?.filter(
      (army) => army.destinationRealmId == realm.realmId
    );

    const vaultValueInLords = getTotalLordsCost({
      costs: filterFoodResources(realm.resources).map((resource) => ({
        resourceId: resource.resourceId,
        amount: getVaultRaidableLaborUnits(
          resource.labor?.vaultBalance
        ).toFixed(0),
      })),
      qty: 1,
    }).toFixed(0);

    // filterFoodResources(realm.resources).reduce(
    //   (acc, resource) => {
    //     const resourceAmount = getVaultRaidableLaborUnits(
    //       resource.labor?.vaultBalance
    //     ).toFixed(0);
    //     return acc + getTotalP;
    //   },
    //   0
    // );

    return (
      <Card ref={ref}>
        {realm?.wonder && (
          <div className="w-full p-2 mb-2 text-2xl font-semibold text-center uppercase rounded shadow-inner bg-gray-1000 tracking-veryWide">
            {realm?.wonder}
          </div>
        )}
        {/* Header */}
        <div className="flex w-full">
          <div className="flex self-center justify-between w-full pb-2 border-b border-white/30">
            <div>
              <h3 className="flex">
                {realm.name} | <span className="px-2">{realm.realmId} </span>
              </h3>
            </div>
            <div className="self-center ml-auto">
              <ArmyToolTip army={getArmyById(0, realm)} />
            </div>

            <OrderIcon
              className="self-center"
              size="md"
              order={realm.orderType.toLowerCase()}
            />
          </div>
        </div>
        {/* Body */}

        <div className="flex justify-between w-full mt-1">
          <div className="flex flex-col flex-1">
            <div className="flex items-center w-full my-3 space-x-2">
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
              <Tooltip
                placement="top"
                className="z-20 flex self-center"
                tooltipText={
                  <div className="p-2 text-sm rounded bg-gray-1000 whitespace-nowrap">
                    Approximate $LORDS value of raidable resources
                  </div>
                }
              >
                <div className="flex !ml-4">
                  ~<LordsIcon className="w-3 mr-1 fill-white" />
                  {vaultValueInLords}
                </div>
              </Tooltip>
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
          </div>
          <div>
            <Tooltip
              placement="bottom"
              className="z-10 flex self-center"
              tooltipText={
                <div className="p-2 text-sm rounded bg-gray-1000 whitespace-nowrap">
                  Annexed: The Realm has lost its Relic.
                  <br /> Self Sovereign: The Realm has its Relic.
                </div>
              }
            >
              <div
                className={`self-start text-xs  uppercase ${
                  getIsRealmAnnexed(realm) ? 'text-green-700' : 'text-red-400'
                }`}
              >
                {getIsRealmAnnexed(realm) ? 'self sovereign ' : 'annexed'}
              </div>
            </Tooltip>{' '}
          </div>
        </div>
        <div className="w-full">
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
                  </div>
                }
              >
                <div className="flex">
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

        {isRaiding && (
          <CombatSideBar
            onClose={() => setIsRaiding(false)}
            defendingRealm={realm}
          />
        )}

        <AtlasSidebar
          containerClassName={sidebarClassNames.replace('z-30', 'z-100')}
          isOpen={isTravel}
          onClose={() => setIsTravel(false)}
        >
          {isTravel && (
            <>
              <Travel realm={realm} />
            </>
          )}
        </AtlasSidebar>

        <RealmsDetailSideBar
          isOpen={isDetails}
          onClose={() => setDetails(false)}
          realm={realm}
          buildings={buildings}
          availableFood={availableFood}
          buildingUtilisation={buildingUtilisation}
        />
      </Card>
    );
  }
);

RealmCard.displayName = 'RealmCard';
