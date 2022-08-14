import { Card, CardTitle } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';
import { HistoryCard } from '@/shared/Dashboard/HistoryCard';
import { BaseRealmDetailPanel } from './BaseRealmDetailPanel';

interface RealmHistoryProps {
  realmId: number;
  open: boolean;
}

export function RealmHistory({
  realmId,
  open,
}: RealmHistoryProps): ReactElement {
  const columns = [
    { Header: 'Event', id: 1, accessor: 'event' },
    { Header: 'action', id: 2, accessor: 'action' },
    // { Header: 'Outcome', id: 3, accessor: 'outcome' },
  ];

  const { data: historyData, loading: loadingData } = useGetRealmHistoryQuery({
    variables: { filter: { realmId: { equals: realmId } } },
    pollInterval: 5000,
  });

  console.log(historyData);

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
      };
    })
    .filter((row) => row.event !== '');

  return (
    <BaseRealmDetailPanel open={open}>
      <div className="grid grid-cols-12 gap-6 py-4">
        <Card className="col-start-1 col-end-7">
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
        <Card className="col-start-7 col-end-13">
          <CardTitle>Military History</CardTitle>
          {militaryEventData.map((a, index) => {
            return (
              <HistoryCard
                key={index}
                timeStamp={a.timestamp}
                event={a.event}
                action={a.action}
              >
                {a.resources}
              </HistoryCard>
            );
          })}
        </Card>
      </div>
    </BaseRealmDetailPanel>
  );
}
