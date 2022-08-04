import useCountdown from '@bibliotheca-dao/core-lib/hooks/use-countdown';
import { Button, Card, CardTitle } from '@bibliotheca-dao/ui-lib/base';
import { useStarknetCall } from '@starknet-react/core';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { RaidingSideBar } from '@/components/sidebars/RaidingSideBar';
import { RealmResources } from '@/components/tables/RealmResources';
import { Squad } from '@/constants/index';
import { useRealmContext } from '@/context/RealmDetailContext';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import type { GetRealmQuery } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import useIsOwner from '@/hooks/useIsOwner';
import SidebarHeader from '@/shared/SidebarHeader';
import { SquadBuilder } from '@/shared/squad/Squad';

type Prop = {
  realm?: GetRealmQuery['realm'];
};

const Army: React.FC<Prop> = (props) => {
  const { buildings } = useRealmContext();
  const { build } = useBuildings();
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

  const isOwner = useIsOwner(realm?.settledOwner);

  useEffect(() => {
    setSquadSlot('Defend');

    console.log(buildings);
  }, [realm?.realmId]);

  const { data: troopStatsData } = useGetTroopStatsQuery();
  if (!realm) {
    return null;
  }
  const troops =
    realm.troops?.filter((squad) => squad.squadSlot === Squad[squadSlot]) ?? [];

  const militaryBuildings = [
    {
      title: 'barracks',
      img: '/barracks.png',
      id: 6,
    },
    {
      title: 'Archer Tower',
      img: '/barracks.png',
      id: 7,
    },
    {
      title: 'Mage Tower',
      img: '/barracks.png',
      id: 8,
    },
    {
      title: 'Castle',
      img: '/barracks.png',
      id: 9,
    },
  ];
  return (
    <Card>
      <CardTitle>Build Military Buildings</CardTitle>
      <div className="flex space-x-2">
        {militaryBuildings.map((a, i) => {
          return (
            <div key={i} className="p-1 border rounded border-white/20">
              <Image
                height={300}
                width={300}
                className="w-64 h-64 rounded"
                src={a.img}
                alt=""
              />
              <div className="p-3 capitalize">
                <h3>{a.title}</h3>
                <hr className="opacity-20" />
                <h5 className="my-2">Qty Built:</h5>
                <h5 className="my-2">Decay time:</h5>
                <div className="flex w-full mt-3">
                  <Button
                    onClick={() => build(realm.realmId, a.id, 1)}
                    className="w-full"
                    size="xs"
                    variant="primary"
                  >
                    build
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="px-2 py-1 font-semibold tracking-widest bg-gray-800">
        <h3>{squadSlot}ing Army</h3>
        {isOwner ? (
          <button
            onClick={() =>
              setSquadSlot((prev) => (prev == 'Attack' ? 'Defend' : 'Attack'))
            }
            className="text-blue-300 hover:underline"
          >
            View {squadSlot == 'Attack' ? 'Defend' : 'Attack'}ing Army
          </button>
        ) : null}
      </div> */}
      {/* <SquadBuilder
        squad={squadSlot}
        realm={realm}
        withPurchase={true}
        troops={troops}
        troopsStats={troopStatsData?.getTroopStats}
      />
      <AtlasSidebar isOpen={isRaiding}>
        <SidebarHeader
          title="Raiding Plan"
          onClose={() => setIsRaiding(false)}
        ></SidebarHeader>

        <RaidingSideBar realm={realm} />
      </AtlasSidebar> */}
      {/* <div className="col-span-6 md:col-start-3 md:col-end-5">
        <RealmResources
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
      </div> */}
    </Card>
  );
};

export default Army;
