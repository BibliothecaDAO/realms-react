import { Button, Card, CardTitle } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import { useState } from 'react';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { RaidDetailsSideBar } from '@/components/sidebars/RaidDetailsSidebar';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';
import { HistoryCard } from '@/shared/Dashboard/HistoryCard';
import SidebarHeader from '@/shared/SidebarHeader';

interface RealmHistoryProps {
  realmId: number;
}

export function RealmHistory({ realmId }: RealmHistoryProps): ReactElement {
  const { data: historyData, loading: loadingData } = useGetRealmHistoryQuery({
    variables: { filter: { realmId: { equals: realmId } } },
    pollInterval: 5000,
  });
  const [raidDetails, setRaidDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

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

  const handleRaidDetailsClick = (event) => {
    setSelectedEvent(event);
    setRaidDetails(true);
  };

  return (
    <div className="grid grid-cols-12 gap-6 py-4">
      <Card className="col-span-12 md:col-start-1 md:col-end-7">
        <CardTitle>Mercantile History</CardTitle>
        {economicEventData.length
          ? economicEventData.map((a, index) => {
              return (
                <HistoryCard
                  key={index}
                  timeStamp={a.timestamp}
                  event={a.event}
                  action={a.action}
                />
              );
            })
          : 'No History yet'}
      </Card>

      <Card className="col-span-12 md:col-start-7 md:col-end-13">
        <CardTitle>Military History</CardTitle>
        {militaryEventData.length
          ? militaryEventData.map((a, index) => {
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
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleRaidDetailsClick(a)}
                  >
                    Raid Details
                  </Button>
                </HistoryCard>
              );
            })
          : 'No History yet'}
      </Card>

      <AtlasSidebar isOpen={raidDetails}>
        <SidebarHeader title="Raiding" onClose={() => setRaidDetails(false)} />
        <RaidDetailsSideBar event={selectedEvent} />
      </AtlasSidebar>
    </div>
  );
}
