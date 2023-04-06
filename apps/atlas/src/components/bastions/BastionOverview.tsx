import { Button, CardBody } from '@bibliotheca-dao/ui-lib';
import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { BastionEvent as EventType } from '@/components/realms/EventMappings';
import {
  generateBastionEvent,
  generateRealmEvent,
  BastionEvent,
  EventLabels,
} from '@/components/realms/EventMappings';
import { HistoryCard } from '@/components/realms/HistoryCard';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { sidebarClassNames } from '@/constants/ui';
import { useAtlasContext } from '@/context/AtlasContext';
import { useBastionContext } from '@/context/BastionContext';
import { useUIContext } from '@/context/UIContext';
import type { RealmHistoryWhereInput } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { useUi } from '@/hooks/useUi';
import { useGetBastionHistoryQuery } from 'mockup/bastionsData';
import AtlasSidebar from '../map/AtlasSideBar';
import { BaseSideBarPanel } from '../ui/sidebar/BaseSideBarPanel';
import { BastionCard } from './BastionCard';

export function BastionOverview() {
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const {
    mapContext: { selectedAsset },
  } = useAtlasContext();

  const filter: RealmHistoryWhereInput = {
    bastionId: { equals: 3711000 },
    eventType: { equals: 'army_travel' },
  };

  const {
    data: bastionEvents,
    stopPolling,
    startPolling,
    loading,
  } = useGetRealmHistoryQuery({
    variables: {
      filter,
      take: 10,
    },
  });

  useEffect(() => {
    if (loading) stopPolling();
    else startPolling(5000);

    return stopPolling;
  }, [loading, data]);

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
      id="aymeric"
      className={
        'flex h-full right-0 top-0 left-20 bottom-0 fixed z-20 lg:max-w-[15%] items-center'
      }
    >
      <div className="h-2/3 flex flex-col  overflow-hidden bg-black bg-opacity-50 rounded-xl">
        <div className="mb-1 text-sm px-3 py-1">
          Last Update: {new Date(lastUpdate).toLocaleTimeString('en-US')}
        </div>
        {events &&
          events.map((event, index) => (
            <BastionCard event={event} key={index}></BastionCard>
          ))}
      </div>
    </div>
  );
}
