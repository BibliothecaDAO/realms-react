import { Button, CardBody } from '@bibliotheca-dao/ui-lib';
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';
import {
  generateRealmEvent,
  Event as EventType,
  EventLabels,
} from '@/components/realms/EventMappings';
import { HistoryCard } from '@/components/realms/HistoryCard';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { MyRealms } from './MyRealms';

export function AccountOverview() {
  const { address } = useAccount();

  const [eventType, setEventType] = useState<EventType>();

  const { data: accountData } = useGetRealmHistoryQuery({
    variables: {
      filter: {
        realmOwner: { equals: address ? getAccountHex(address) : '' },
        eventType: { equals: eventType },
      },
    },
    pollInterval: 5000,
    skip: !address,
  });

  const events = (accountData?.getRealmHistory ?? [])
    .map((realmEvent) => {
      return {
        ...generateRealmEvent(realmEvent, true),
        timestamp: realmEvent.timestamp,
        eventId: realmEvent.eventId,
        realmId: realmEvent.realmId,
      };
    })
    .filter((row) => row.event !== '');

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-4 md:grid-cols-12">
      <div className={`col-start-1 col-end-13 md:col-start-1 md:col-end-7 `}>
        <div className="p-2 mb-8 ">
          <h2>Your Settled Realms</h2>
          <div className="px-10 mt-4 text-xl italic">
            "Would you like to inspect your lands?"
          </div>
        </div>
        <MyRealms />
      </div>
      <div className={`col-start-1 col-end-13 md:col-start-7 md:col-end-13 `}>
        <div className="p-2 ">
          <h2>Vizir Reports</h2>
          <div className="px-10 mt-4 text-xl italic ">
            "Your Majesty, we have been busy since you have been away."
          </div>
        </div>
        <div className="flex flex-wrap mb-3">
          {Object.keys(EventType).map((key) => {
            return (
              <div className="m-1" key={key}>
                <Button
                  onClick={() => setEventType(EventType[key])}
                  variant="outline"
                  size="xs"
                >
                  {EventLabels[EventType[key]]}
                </Button>
              </div>
            );
          })}
        </div>

        <CardBody>
          {events
            ? events.map((a, index) => {
                return (
                  <HistoryCard
                    key={index}
                    timeStamp={a.timestamp}
                    event={a.event}
                    eventId={a.eventId}
                    action={a.action}
                    image={a.image}
                    realmId={a.realmId}
                  >
                    {a.relic}
                    {a.resources}
                  </HistoryCard>
                );
              })
            : 'loading'}
        </CardBody>
      </div>
    </div>
  );
}
