import { Card, CardTitle } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';
import { HistoryCard } from '@/shared/Dashboard/HistoryCard';

interface RealmHistoryProps {
  realmId: number;
}

export function RealmHistory({ realmId }: RealmHistoryProps): ReactElement {
  const { data: historyData, loading: loadingData } = useGetRealmHistoryQuery({
    variables: { filter: { realmId: { equals: realmId } } },
    pollInterval: 5000,
  });

  const economicEventData = (historyData?.getRealmHistory ?? [])
    .map((realmEvent) => {
      return {
        ...genEconomicRealmEvent(realmEvent),
        timestamp: realmEvent.timestamp,
      };
    })
    .filter((row) => row.event !== '');

  const militaryEventData = (historyData?.getRealmHistory ?? [])
    .map((realmEvent) => {
      return {
        ...genMilitaryRealmEvent(realmEvent, false),
        timestamp: realmEvent.timestamp,
        eventId: realmEvent.eventId,
      };
    })
    .filter((row) => row.event !== '');

  return (
    <div className="grid grid-cols-12 gap-6 py-4">
      <Card className="col-span-12 md:col-start-1 md:col-end-7">
        <CardTitle>Mercantile History</CardTitle>
        {economicEventData.map((a, index) => {
          return (
            <HistoryCard
              key={index}
              timeStamp={a.timestamp}
              event={a.event}
              action={a.action}
            />
          );
        })}
      </Card>
      <Card className="col-span-12 md:col-start-7 md:col-end-13">
        <CardTitle>Military History</CardTitle>
        {militaryEventData.map((a, index) => {
          return (
            <HistoryCard
              key={index}
              timeStamp={a.timestamp}
              eventId={a.eventId}
              event={a.event}
              action={a.action}
            >
              {a.resources}
              {a.relic}
            </HistoryCard>
          );
        })}
      </Card>
    </div>
  );
}
