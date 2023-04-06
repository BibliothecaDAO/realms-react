import { useEffect, useMemo, useState } from 'react';
import { generateBastionEvent } from '@/components/realms/EventMappings';
import { useAtlasContext } from '@/context/AtlasContext';
import type { RealmHistoryWhereInput } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { BastionCard } from './BastionCard';

export function BastionOverview() {
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const {
    mapContext: { selectedAsset },
  } = useAtlasContext();

  const filter: RealmHistoryWhereInput = {
    bastionId: { equals: parseInt(selectedAsset.id) },
    eventType: { not: { equals: 'realm_combat_defend' } },
  };

  const {
    data: bastionEvents,
    stopPolling,
    startPolling,
    loading,
  } = useGetRealmHistoryQuery({
    variables: {
      filter,
      take: 20,
    },
  });

  useEffect(() => {
    if (loading) stopPolling();
    else startPolling(5000);

    return stopPolling;
  }, [loading, bastionEvents, startPolling, stopPolling]);

  const events = (bastionEvents?.getRealmHistory ?? []).map((bastionEvent) => {
    return {
      ...generateBastionEvent(bastionEvent),
      timestamp: bastionEvent.timestamp,
      eventId: bastionEvent.eventId,
      realmId: bastionEvent.realmId,
    };
  });

  useMemo(() => {
    const now = new Date().getTime();
    setLastUpdate(now);
  }, []);

  return (
    <div
      className={
        'fixed flex w-[20%] max-w-xs mt-10 left-[60px] top-0 bottom-5 items-center'
      }
    >
      {!loading && bastionEvents && selectedAsset && (
        <div className="flex max-h-[90%] h-full w-full flex-col overflow-y-scroll bg-black bg-opacity-50 rounded-xl">
          <div className="mb-1 text-sm px-3 py-1">
            Last Update: {new Date(lastUpdate).toLocaleTimeString('en-US')}
          </div>
          {events &&
            events.map((event, index) => (
              <BastionCard event={event} key={index}></BastionCard>
            ))}
        </div>
      )}
    </div>
  );
}
