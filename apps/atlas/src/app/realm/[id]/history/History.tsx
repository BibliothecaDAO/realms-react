'use client';
import { Button, Card, CardTitle } from '@bibliotheca-dao/ui-lib';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';

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
import { resourcePillaged } from '@/shared/Getters/Realm';
import SidebarHeader from '@/shared/SidebarHeader';
import type { RealmEvents } from '@/types/index';
import {
  realmMilitaryEvents,
  realmEvents,
  realmEconomicEvents,
} from '@/types/index';

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

  const militaryEventData = historyData?.getRealmHistory.filter((event) =>
    Object.values(realmMilitaryEvents).includes(
      event.eventType as unknown as realmMilitaryEvents
    )
  );

  const economicEventData = historyData?.getRealmHistory.filter((event) =>
    Object.values(realmEconomicEvents).includes(
      event.eventType as unknown as realmEconomicEvents
    )
  );

  const economicEventData1 = (historyData?.getRealmHistory ?? [])
    .map((realmEvent) => {
      return {
        ...genEconomicRealmEvent(realmEvent),
        timestamp: realmEvent.timestamp,
      };
    })
    .filter((row) => row.event !== '');

  const militaryEventData1 = (historyData?.getRealmHistory ?? [])
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
    <div className="grid gap-6 py-4">
      <Card className=" md:col-span-6">
        <CardTitle>Mercantile History</CardTitle>
        {economicEventData?.length
          ? economicEventData.map((a, index) => {
              return (
                <HistoryCard
                  key={index}
                  timeStamp={a.timestamp}
                  event={
                    a.eventType == realmEconomicEvents.realmBuildingBuilt
                      ? 'Building Built'
                      : 'Realm Transferred'
                  }
                  action={''}
                />
              );
            })
          : 'No History yet'}
      </Card>

      <Card className="col-span-12 md:col-span-6">
        <CardTitle>Military History</CardTitle>
        <div className="grid gap-3">
          {militaryEventData?.length
            ? militaryEventData.map((a, index) => {
                return (
                  <HistoryCard
                    key={index}
                    timeStamp={a.timestamp}
                    eventId={a.eventId}
                    event={
                      a.eventType == realmMilitaryEvents.realmCombatAttack
                        ? `Army Raided Realm ${a.data.defendRealmId}`
                        : `Raided by Realm ${a.data.attackRealmId}`
                    }
                    action={''}
                  >
                    {a.eventType === realmMilitaryEvents.realmCombatAttack &&
                      (a.data.success ? (
                        <div className="flex">
                          <Sword className="w-6 mr-2" />
                          <span className="text-green-300">
                            Successful Raid!
                          </span>
                        </div>
                      ) : (
                        <div className="flex">
                          <Danger className="self-center w-6 h-6 fill-current" />
                          <span className="text-red-400">Raid Failed</span>
                        </div>
                      ))}
                    {a.eventType === realmMilitaryEvents.realmCombatDefend &&
                      (a.data.success ? (
                        <div className="flex">
                          <Sword className="w-6" />
                          <span>Defended</span>
                        </div>
                      ) : (
                        <div className="flex">
                          <Danger className="self-center w-6 h-6 mr-2 fill-current" />
                          <span className="text-red-400">Pillaged</span>
                        </div>
                      ))}
                    {resourcePillaged(a.data?.pillagedResources)}
                    {a.data?.relicLost && (
                      <span className="pl-10 text-xl font-semibold uppercase">
                        Relic {a.data?.relicLost}
                      </span>
                    )}
                    <Button
                      size="xs"
                      variant="primary"
                      onClick={() => handleRaidDetailsClick(a)}
                    >
                      Raid Details
                    </Button>
                  </HistoryCard>
                );
              })
            : 'No History yet'}
        </div>
      </Card>

      <AtlasSidebar
        containerClassName="z-20 w-full md:w-1/2"
        isOpen={raidDetails}
      >
        <SidebarHeader onClose={() => setRaidDetails(false)} />
        <RaidDetailsSideBar event={selectedEvent} />
      </AtlasSidebar>
    </div>
  );
}
