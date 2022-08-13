import useCountdown from '@bibliotheca-dao/core-lib/hooks/use-countdown';
import {
  Button,
  Card,
  CardTitle,
  InputNumber,
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
import useIsOwner from '@/hooks/useIsOwner';
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
  const troops =
    realm.troops?.filter((squad) => squad.squadSlot === Squad[squadSlot]) ?? [];

  return (
    <BaseRealmDetailPanel open={props.open}>
      <div className="grid grid-cols-12 gap-6">
        {isOwner && (
          <Card loading={props.loading} className="col-span-12 md:col-span-9">
            <CardTitle>Military Buildings</CardTitle>
            <div className="flex flex-wrap">
              {props.buildings
                ?.filter((a) => a.type === 'military')
                .map((a, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-wrap w-1/2 p-3 border rounded border-white/20"
                    >
                      <div className="self-center">
                        <Image
                          height={200}
                          width={200}
                          className="w-64 h-auto bg-white rounded"
                          src={a.img}
                          alt=""
                        />
                      </div>

                      <div className="p-4 capitalize">
                        <h2>{a.name}</h2>

                        <div className="flex flex-wrap">
                          <div className="w-1/2">
                            <h5>Quantity:</h5>
                            <p className="text-2xl">{a.quantityBuilt}</p>
                          </div>
                          <div className="w-1/2">
                            <h5>Usage:</h5>
                            <p className="text-2xl">{a.sqmUsage} sqm</p>
                          </div>
                          <div className="w-1/2">
                            <h5>size:</h5>
                            <p className="text-2xl">{a.buildingSize} sqm</p>
                          </div>
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
                      </div>
                      <div className="flex w-full space-x-3">
                        {troopList
                          .filter((b) => b.buildingId === a.id)
                          .map((c, i) => {
                            return (
                              <div key={i} className="flex flex-col w-full">
                                <div className="flex justify-center p-2 bg-red-700 border-4 border-double rounded-xl border-white/40">
                                  <Image
                                    height={75}
                                    width={75}
                                    className="object-contain h-auto"
                                    src={'/realm-troops/' + c.img}
                                    alt=""
                                  />
                                </div>

                                <h5 className="">{c.name}</h5>
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

        <Card
          loading={props.loading}
          className="col-span-12 md:col-start-1 md:col-end-5"
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
        <Card loading={props.loading} className="col-span-12 md:col-span-8">
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
            troops={troops}
            troopsStats={troopStatsData?.getTroopStats}
            onClose={() => setIsRaiding(false)}
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
