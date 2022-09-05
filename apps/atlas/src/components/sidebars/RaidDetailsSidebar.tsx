import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { RaidResults } from '@/components/tables/RaidResults';
import { Squad } from '@/constants/index';
import { TroopSlot } from '@/constants/troops';
import type { GetRealmQuery, GetRealmsQuery } from '@/generated/graphql';
import useCombat from '@/hooks/settling/useCombat';
import RealmSelector from '@/shared/RealmSelector';
import SquadStatistics from '@/shared/squad/SquadStatistics';

type Prop = {
  event?: any;
};

export const RaidDetailsSideBar: React.FC<Prop> = (props) => {
  const event = props.event;
  const [selectedRealms, setSelectedRealms] = useState<
    GetRealmsQuery['realms']
  >([]);
  return (
    <div>
      {/* <p>Tx Hash: {combatData} </p> */}
      <RaidResults defendId={event.defendRealmId} tx={event.txHash} />
    </div>
  );
};
