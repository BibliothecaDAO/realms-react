import { Button, CardBody } from '@bibliotheca-dao/ui-lib';
import { useAccount } from '@starknet-react/core';
import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  generateRealmEvent,
  BastionEvent as EventType,
  EventLabels,
} from '@/components/realms/EventMappings';
import { HistoryCard } from '@/components/realms/HistoryCard';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { sidebarClassNames } from '@/constants/ui';
import { useUIContext } from '@/context/UIContext';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { useUi } from '@/hooks/useUi';
import AtlasSidebar from '../map/AtlasSideBar';
import { BaseSideBarPanel } from '../ui/sidebar/BaseSideBarPanel';

export function BastionOverview() {
  const { address } = useAccount();

  const { vizirSidebar, toggleVizir } = useUIContext();

  const [eventType, setEventType] = useState<EventType>();
  const [lastUpdate, setLastUpdate] = useState<number>(0);

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

  //   console.log('aymeric');
  //   console.log(events);

  useMemo(() => {
    const now = new Date().getTime();

    setLastUpdate(now);
  }, [accountData]);

  return (
    <AtlasSidebar
      isOpen={vizirSidebar}
      onClose={toggleVizir}
      position={'left'}
      containerClassName={twMerge(sidebarClassNames, 'z-20 lg:max-w-[33%]')}
    >
      <BaseSideBarPanel>
        <div className="flex p-2">
          <div>
            <div className="p-2 ">
              <h2>Vizir Reports</h2>
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
            <div className="mb-1 text-sm">
              Last Update: {new Date(lastUpdate).toLocaleTimeString('en-US')}
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
      </BaseSideBarPanel>
    </AtlasSidebar>
  );
}
