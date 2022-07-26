import React, { useEffect, useState } from 'react';
import { Squad } from '@/constants/index';
import type { GetRealmQuery } from '@/generated/graphql';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import useIsOwner from '@/hooks/useIsOwner';
import { SquadBuilder } from '@/shared/squad/Squad';

type Prop = {
  realm?: GetRealmQuery;
};

const Military: React.FC<Prop> = (props) => {
  const realm = props.realm?.realm;

  // Always initialize with defending army
  const [squadSlot, setSquadSlot] = useState<keyof typeof Squad>('Defend');

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
      <div className="font-semibold bg-gray-800 px-2 py-1 tracking-widest rounded-lg">
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
    </>
  );
};

export default Military;
