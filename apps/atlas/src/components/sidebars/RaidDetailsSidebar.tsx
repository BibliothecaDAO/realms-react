import React, { useState } from 'react';
import { RaidResults } from '@/components/tables/RaidResults';
import type { GetRealmsQuery } from '@/generated/graphql';

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
