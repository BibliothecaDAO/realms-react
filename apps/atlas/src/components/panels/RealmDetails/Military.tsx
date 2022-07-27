import { Button } from '@bibliotheca-dao/ui-lib/base';
import React, { useEffect, useState } from 'react';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { RealmResources } from '@/components/tables/RealmResources';
import { Squad } from '@/constants/index';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import type { GetRealmQuery, GetRealmsQuery } from '@/generated/graphql';
import useIsOwner from '@/hooks/useIsOwner';
import RealmSelector from '@/shared/RealmSelector';
import SidebarHeader from '@/shared/SidebarHeader';
import { SquadBuilder } from '@/shared/squad/Squad';
import SquadStatistics from '@/shared/squad/SquadStatistics';

type Prop = {
  realm?: GetRealmQuery;
};

const Military: React.FC<Prop> = (props) => {
  const realm = props.realm?.realm;

  // Always initialize with defending army
  const [squadSlot, setSquadSlot] = useState<keyof typeof Squad>('Defend');

  const [selectedRealms, setSelectedRealms] = useState<
    GetRealmsQuery['realms']
  >([]);

  const [isRaiding, setIsRaiding] = useState(false);

  const isOwner = useIsOwner(realm?.settledOwner);

  useEffect(() => {
    setSquadSlot('Defend');
  }, [realm?.realmId]);

  const { data: troopStatsData } = useGetTroopStatsQuery();
  if (!realm) {
    return null;
  }
  const troops =
    realm.troops?.filter((squad) => squad.squadSlot === Squad[squadSlot]) ?? [];

  return (
    <>
      <div className="font-semibold mt-2 bg-gray-800 px-2 py-1 tracking-widest rounded-lg">
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
      </div>
      <SquadBuilder
        squad={squadSlot}
        realmId={realm.realmId}
        withPurchase={true}
        troops={troops}
        troopsStats={troopStatsData?.getTroopStats}
      />
      <AtlasSidebar isOpen={isRaiding}>
        <SidebarHeader
          title="Battle Plan"
          onClose={() => setIsRaiding(false)}
        ></SidebarHeader>
        <h3>Attacking Realm</h3>
        <RealmSelector onSelect={(r) => setSelectedRealms(r)} />
        <div className="flex justify-between">
          <h3>Defenders</h3>
          <h3>Attacker</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 divide-x-2 divide-dotted divide-slate-200">
          <SquadStatistics
            troopsQueued={[]}
            troops={realm.troops!}
          ></SquadStatistics>
          {selectedRealms && selectedRealms.length > 0 ? (
            <SquadStatistics
              className="pl-2"
              reversed
              troopsQueued={[]}
              troops={selectedRealms[0]?.troops || []}
            ></SquadStatistics>
          ) : (
            <div className="flex justify-center items-center">
              Select <br />
              Realm
            </div>
          )}
        </div>

        <Button variant="primary" className="w-full">
          Order the Assault
        </Button>
      </AtlasSidebar>
      <div className="col-span-6 md:col-start-3 md:col-end-5">
        <RealmResources
          header={
            <>
              <h3>Vault</h3>{' '}
              {!isOwner && (
                <Button
                  onClick={() => setIsRaiding(true)}
                  className="text-black"
                  size="sm"
                  variant="attack"
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
      </div>
    </>
  );
};

export default Military;
