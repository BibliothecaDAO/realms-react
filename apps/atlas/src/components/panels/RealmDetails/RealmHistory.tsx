import {
  Table,
  Button,
  ResourceIcon,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib';
import { formatEther } from '@ethersproject/units';
import type { ReactElement } from 'react';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';
import { HistoryCard } from '@/shared/Dashboard/HistoryCard';
import { shortenAddress } from '@/util/formatters';
import { findResourceName } from '@/util/resources';
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
        ...genMilitaryRealmEvent(realmEvent),
        timestamp: realmEvent.timestamp,
      };
    })
    .filter((row) => row.event !== '');

  return (
    <BaseRealmDetailPanel open={open}>
      <div className="grid grid-cols-12 gap-6 py-4">
        <Card className="col-start-1 col-end-6">
          <CardTitle>Mercantile History</CardTitle>
          {economicEventData.map((a, index) => {
            return (
              <HistoryCard
                key={index}
                timeStamp={a.timestamp}
                event={a.event}
                action={a.action}
              />
              // <Card
              //   key={index}
              //   className={`w-full ${loadingData ?? 'animate-pulse'}`}
              // >
              //   <CardBody className={`flex ${a.event.class} `}>
              //     <span className="py-1 mb-1 text-xs font-semibold text-white">
              //       {new Date(a.timestamp).toLocaleTimeString('en-US')}{' '}
              //       {new Date(a.timestamp).toLocaleDateString('en-US')}
              //     </span>
              //     <h5 className="text-white">{a.event.event}</h5>
              //     {a.event?.resources && a.event.resources}
              //     <div className="mt-4">{a.event.action}</div>
              //   </CardBody>
              // </Card>
            );
          })}
        </Card>
        {/* <Card className="col-start-7 col-end-13">
          <CardTitle>Military History</CardTitle>
          {militaryEventData.map((a, index) => {
            return (
              <HistoryCard
                key={index}
                timeStamp={a.timestamp}
                event={a.event}
                action={a.action}
              />
            );
          })}
        </Card> */}
      </div>
    </BaseRealmDetailPanel>
  );
}
