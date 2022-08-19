import useCountdown from '@bibliotheca-dao/core-lib/hooks/use-countdown';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CountdownTimer,
  InputNumber,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';
import { useStarknetCall } from '@starknet-react/core';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { RaidingSideBar } from '@/components/sidebars/RaidingSideBar';
import { RealmResources } from '@/components/tables/RealmResources';
import { RealmBuildingId, HarvestType } from '@/constants/buildings';
import { Squad } from '@/constants/index';
import { troopList } from '@/constants/troops';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import type { GetRealmQuery } from '@/generated/graphql';
import useBuildings, {
  createBuildingCall,
} from '@/hooks/settling/useBuildings';
import useCombat from '@/hooks/settling/useCombat';
import useIsOwner from '@/hooks/useIsOwner';
import { hasOwnRelic } from '@/shared/Getters/Realm';
import SidebarHeader from '@/shared/SidebarHeader';
import { SquadBuilder } from '@/shared/squad/Squad';
import type { BuildingDetail, AvailableResources } from '@/types/index';
import { BaseRealmDetailPanel } from './BaseRealmDetailPanel';

type Prop = {
  realm: GetRealmQuery['realm'];
  buildings: BuildingDetail[] | undefined;
  availableResources: AvailableResources;
  open: boolean;
  loading: boolean;
};

interface BuildQuantity {
  barracks: string;
  archerTower: string;
  castle: string;
  mageTower: string;
}

const Army: React.FC<Prop> = (props) => {
  const realm = props.realm;

  // Always initialize with defending army
  const [squadSlot, setSquadSlot] = useState<keyof typeof Squad>('Defend');

  const { troops } = useCombat();

  const timeAttacked = realm?.lastAttacked
    ? new Date(parseInt(realm.lastAttacked)).getTime()
    : 0;

  const vaultCooldownMinutes = 30;
  const attackingCooldownMinutes = 10;

  const time = (timestamp: any, minutes: number) => {
    const cooldownSeconds = 60 * minutes;
    const t = timestamp ? new Date(parseInt(timestamp)).getTime() : 0;
    return (t + cooldownSeconds).toString();
  };

  const vaultCountdown = useCountdown({
    date: time(realm?.lastAttacked, vaultCooldownMinutes),
  });

  const [isRaiding, setIsRaiding] = useState(false);
  const txQueue = useTransactionQueue();
  const isOwner = useIsOwner(realm?.settledOwner);

  const [buildQty, setBuildQty] = useState<BuildQuantity>({
    barracks: '1',
    archerTower: '1',
    castle: '1',
    mageTower: '1',
  });

  useEffect(() => {
    setSquadSlot('Defend');
    setBuildQty({
      barracks: '1',
      archerTower: '1',
      castle: '1',
      mageTower: '1',
    });
  }, [realm?.realmId]);

  const { data: troopStatsData } = useGetTroopStatsQuery();
  if (!realm) {
    return null;
  }
  const realmTroops =
    realm.troops?.filter((squad) => squad.squadSlot === Squad[squadSlot]) ?? [];

  const getMilitaryBuildingsBuilt = (
    buildings: BuildingDetail[] | undefined
  ) => {
    return buildings
      ?.filter((a) => a.type === 'military')
      .filter((b) => b.quantityBuilt > 0)
      .map((c) => c.id);
  };

  return (
    <BaseRealmDetailPanel open={props.open}>
      <div className="grid grid-cols-12 gap-6">
        {isOwner && (
          <Card
            loading={props.loading}
            className="col-span-12 row-span-3 md:col-span-5"
          >
            <CardTitle>Military Buildings</CardTitle>
            <div className="flex flex-wrap">
              {props.buildings
                ?.filter((a) => a.type === 'military')
                .map((a, i) => {
                  return (
                    <div key={i} className="flex flex-wrap w-full p-3 rounded">
                      <div className="self-center">
                        <Image
                          height={200}
                          width={200}
                          className="object-fill bg-white rounded-2xl"
                          src={a.img}
                          alt=""
                        />
                      </div>

                      <div className="p-4 capitalize">
                        <h3>{a.name}</h3>

                        <div className="flex flex-wrap">
                          <div className="w-1/3">
                            <p className="sm:text-4xl">{a.quantityBuilt}</p>

                            <CountdownTimer
                              date={(a.buildingDecay * 1000).toString()}
                            />
                          </div>
                          {/* <div className="w-1/3">
                            <h5>Usage:</h5>
                            <p className="text-xl">{a.sqmUsage} sqm</p>
                          </div> */}
                          {/* <div className="w-1/3">
                            <h5>size:</h5>
                            <p className="text-xl">{a.buildingSize} sqm</p>
                          </div> */}
                        </div>

                        {/* <h5 className="my-2">Decay time:</h5> */}
                        <div className="flex w-full mt-3 space-x-2">
                          <Button
                            onClick={() =>
                              txQueue.add(
                                createBuildingCall.build({
                                  realmId: realm.realmId,
                                  buildingId: a.id,
                                  qty: buildQty[a.key],
                                })
                              )
                            }
                            className="w-full"
                            size="xs"
                            variant="primary"
                          >
                            build
                          </Button>
                          <InputNumber
                            value={buildQty[a.key]}
                            inputSize="sm"
                            colorScheme="transparent"
                            className="w-12 bg-white border rounded border-white/40"
                            min={1}
                            max={10}
                            stringMode
                            onChange={(value) =>
                              setBuildQty((current) => {
                                return {
                                  ...current,
                                  [a.key]: value.toString(),
                                };
                              })
                            }
                          />{' '}
                        </div>
                        <div className="flex mt-4">
                          {a.cost &&
                            a.cost.map((a, i) => {
                              return (
                                <div
                                  key={i}
                                  className="px-1 font-extrabold text-center"
                                >
                                  <ResourceIcon
                                    size="xs"
                                    resource={a.resourceName}
                                  />
                                  {a.amount}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <div className="flex w-full space-x-3">
                        {troops
                          ?.filter((b) => b.buildingId === a.id)
                          .map((c, i) => {
                            return (
                              <div
                                key={i}
                                className="flex flex-col w-full text-center"
                              >
                                <div
                                  className={`flex justify-center p-2 border-4 border-double rounded-xl border-white/40 ${c.troopColour}`}
                                >
                                  <Image
                                    height={75}
                                    width={75}
                                    className="object-contain h-auto"
                                    src={'/realm-troops/' + c.troopImage}
                                    alt=""
                                  />
                                </div>

                                <h5 className="">{c.troopName}</h5>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        )}
        <Card className="col-span-12 md:col-start-6 md:col-end-10">
          <CardTitle>
            {realm.name} owns a total of {realm.relicsOwned?.length} Realms
          </CardTitle>

          <CardBody>
            <p>
              Capture other Realms Relics by raiding them. It is frowned upon to
              not hold your Relic. You must get it back at all costs!
            </p>{' '}
            {realm.relicsOwned?.map((a, i) => {
              return (
                <div key={i} className="mb-4">
                  {' '}
                  <h3>Realm {a.realmId}</h3>
                  <Button
                    href={'/realm/' + a.realmId + '?tab=Army'}
                    variant="outline"
                    size="sm"
                  >
                    Visit {a.realmId}
                  </Button>
                </div>
              );
            })}
          </CardBody>
        </Card>
        <Card className="col-span-12 md:col-start-10 md:col-end-13">
          <CardBody>
            {hasOwnRelic(realm) ? (
              <div>
                <h2>Not conquered!</h2>
                <p className="text-xl">
                  Citizens of {realm?.name} are living peacefully on its lands.
                  The Lord of {realm?.name} is keeping them safe from Goblins
                  and other warmongering realms.
                </p>
              </div>
            ) : (
              <div>
                {realm?.relic?.map((a, i) => {
                  return (
                    <div key={i} className="mb-4">
                      <h2>Conquered by Realm {a.heldByRealm}</h2>{' '}
                      <p className="text-xl">
                        {realm?.name} has been Conquered by Realm{' '}
                        {a.heldByRealm}. The citizens shake in fear everyday
                        thinking it will be their last... won't someone think of
                        the children!
                      </p>
                      <div className="mt-4">
                        <Button
                          href={'/realm/' + a.heldByRealm + '?tab=Army'}
                          variant="outline"
                          size="sm"
                        >
                          Visit realm {a.heldByRealm}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
        <Card
          loading={props.loading}
          className="col-span-12 md:col-start-6 md:col-end-13"
        >
          <CardTitle>Raidable Resources</CardTitle>
          <RealmResources
            realm={realm}
            loading={false}
            hideLordsClaimable
            showRaidable
          />

          {!isOwner && (
            <div className="w-full mt-3">
              <Button
                onClick={() => setIsRaiding(true)}
                size="lg"
                className="w-full"
                disabled={!vaultCountdown.expired}
                variant={'primary'}
              >
                Raid Vault
              </Button>
              <p className="p-3">
                Pillage this vault for 25% of it's resources.
              </p>
            </div>
          )}
        </Card>

        <Card
          loading={props.loading}
          className="col-span-12 md:col-start-6 md:col-end-13"
        >
          <div className="flex justify-between">
            <CardTitle>{squadSlot}ing Army</CardTitle>

            {isOwner && (
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    setSquadSlot((prev) =>
                      prev == 'Attack' ? 'Defend' : 'Attack'
                    )
                  }
                >
                  View {squadSlot == 'Attack' ? 'Defend' : 'Attack'}ing Army
                </Button>
              </div>
            )}
          </div>

          <SquadBuilder
            squad={squadSlot}
            realm={realm}
            withPurchase={true}
            troops={realmTroops}
            troopsStats={troopStatsData?.getTroopStats}
            onClose={() => setIsRaiding(false)}
            militaryBuildingsBuilt={getMilitaryBuildingsBuilt(props.buildings)}
          />
        </Card>

        <AtlasSidebar isOpen={isRaiding}>
          <SidebarHeader
            title="Raiding"
            onClose={() => setIsRaiding(false)}
          ></SidebarHeader>

          <RaidingSideBar realm={realm} />
        </AtlasSidebar>
      </div>
    </BaseRealmDetailPanel>
  );
};

export default Army;
