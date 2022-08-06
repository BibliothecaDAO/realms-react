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

type Prop = {
  realm: GetRealmQuery['realm'];
  buildings: BuildingDetail[] | undefined;
  availableResources: AvailableResources;
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
    <div className="grid grid-cols-12 gap-6">
      <Card className="col-span-8">
        <CardTitle>Build Military Buildings</CardTitle>
        <div className="flex space-x-2">
          {props.buildings
            ?.filter((a) => a.type === 'military')
            .map((a, i) => {
              return (
                <div key={i} className="p-1 border rounded border-white/20">
                  <Image
                    height={300}
                    width={300}
                    className="w-64 h-64 bg-white rounded"
                    src={a.img}
                    alt=""
                  />
                  <div className="p-3 capitalize">
                    <h3>{a.name}</h3>
                    <hr className="opacity-20" />
                    <h5 className="my-2">Quantity Built: {a.quantityBuilt}</h5>
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
                </div>
              );
            })}
        </div>
      </Card>
      <Card className="col-span-4">
        <CardTitle>Raidable Resources</CardTitle>
        <RealmResources
          availableResources={props.availableResources}
          header={
            <>
              <h3>Vault</h3>{' '}
              {!isOwner && (
                <Button
                  onClick={() => setIsRaiding(true)}
                  className="text-black"
                  size="sm"
                  disabled={!vaultCountdown.expired}
                  variant={vaultCountdown.expired ? 'attack' : 'outline'}
                >
                  Raid Vault
                </Button>
              )}
            </>
          }
          realm={realm}
          loading={false}
          hideLordsClaimable
          showRaidable
        />
      </Card>
      <Card className="col-span-4">
        <CardTitle>{squadSlot}ing Army</CardTitle>

        {/* TODO: add back for indexer */}
        {/* {isOwner ? ( */}
        <button
          onClick={() =>
            setSquadSlot((prev) => (prev == 'Attack' ? 'Defend' : 'Attack'))
          }
          className="text-blue-300 hover:underline"
        >
          View {squadSlot == 'Attack' ? 'Defend' : 'Attack'}ing Army
        </button>
        {/* ) : null} */}
        <SquadBuilder
          squad={squadSlot}
          realm={realm}
          withPurchase={true}
          troops={troops}
          troopsStats={troopStatsData?.getTroopStats}
        />
      </Card>

      <AtlasSidebar isOpen={isRaiding}>
        <SidebarHeader
          title="Raiding Plan"
          onClose={() => setIsRaiding(false)}
        ></SidebarHeader>

        <RaidingSideBar realm={realm} />
      </AtlasSidebar>
    </div>
  );
};

export default Army;
