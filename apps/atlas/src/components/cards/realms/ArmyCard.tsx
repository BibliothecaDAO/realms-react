import {
  Button,
  Card,
  CountdownTimer,
  OrderIcon,
  Tabs,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useMemo, useState } from 'react';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import { fetchRealmNameById, getTravelTime } from '@/shared/Getters/Realm';
import { ArmyBattalions } from './armyCard/ArmyBattalions';
import { ArmyStatistics } from './armyCard/ArmyStatistics';

export interface ArmyAndOrder extends Army {
  orderType?: string;
}

type Prop = {
  army: ArmyAndOrder;
  onBuildArmy?: () => void;
  onTravel?: () => void;
  selectedRealm?: number;
};

export const ArmyCard: React.FC<Prop> = (props) => {
  const { play } = useUiSounds(soundSelector.pageTurn);
  const [selectedTab, setSelectedTab] = useState(0);
  const { getArmyStats } = useArmy();
  const army = props.army;
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const armyStats = getArmyStats(props.army);

  const armyLocation =
    army.destinationRealmId == 0 ? army.realmId : army.destinationRealmId;

  // bools
  const isAtLocation = armyLocation == props.selectedRealm;

  const isHome = [0, army.realmId].includes(army?.destinationRealmId);

  const travelInformation = getTravelTime({
    travellerId: armyLocation,
    destinationId: props.selectedRealm,
  });

  const hasArrived = army?.destinationArrivalTime > new Date().getTime();

  const tabs = useMemo(
    () => [
      {
        label: <Map className="self-center w-6 h-6 fill-current" />,
        component: (
          <ArmyStatistics
            armyStatistics={armyStats}
            army={props.army}
            isAtLocation={isAtLocation}
            selectedRealm={props.selectedRealm}
            onTravel={props.onTravel}
            onBuildArmy={props.onBuildArmy}
            isHome={isHome}
          />
        ),
      },
      {
        label: <Head className="self-center w-6 h-6 fill-current" />,
        component: (
          <ArmyBattalions
            armyStatistics={armyStats}
            army={props.army}
            isAtLocation={isAtLocation}
            selectedRealm={props.selectedRealm}
            onTravel={props.onTravel}
            onBuildArmy={props.onBuildArmy}
            isHome={isHome}
          />
        ),
      },
    ],
    [army]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <Card key={army.armyId} className="flex flex-col">
      <h3 className="flex justify-between">
        #{army.armyId == 0 ? '' : army.realmId} | Army{' '}
        {army.armyId == 0 ? 'Defending' : army.armyId}{' '}
        <OrderIcon
          className="ml-auto"
          size="sm"
          order={army.orderType ? army.orderType.toLowerCase() : ''}
        />{' '}
      </h3>
      <div className="flex justify-between">
        <h2>{fetchRealmNameById(army.realmId)}</h2>
      </div>
      {hasArrived && (
        <div className="flex text-sm font-semibold rounded ">
          <CountdownTimer date={army?.destinationArrivalTime} /> ETA arrival
        </div>
      )}
      <div className="flex justify-between">
        <div>
          {army.armyId != 0 &&
            (isAtLocation ? (
              <h5>{hasArrived ? 'on the way' : 'here'}</h5>
            ) : (
              <Button
                onClick={() => {
                  navigateToAsset(
                    army?.destinationRealmId
                      ? army?.destinationRealmId
                      : army.realmId,
                    'realm'
                  );
                }}
                variant="outline"
                size="xs"
                className="w-full uppercase"
              >
                <Globe className="w-3 mr-2 fill-current" />
                {!isHome ? army?.destinationRealmId : 'Home'}
              </Button>
            ))}
        </div>
      </div>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="default"
      >
        <Tabs.List className="">
          {tabs.map((tab, index) => (
            <Tabs.Tab key={index} className="uppercase">
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panels>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>

      <div className="grid grid-cols-1 gap-2 mt-4">
        {isHome && isAtLocation && (
          <Button
            variant="primary"
            size="xs"
            onClick={() => props.onBuildArmy && props.onBuildArmy()}
          >
            Recruit Army
          </Button>
        )}
        {props.onTravel && !isAtLocation && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => props.onTravel && props.onTravel()}
          >
            Travel: {(travelInformation.time / 60).toFixed(2)} m
          </Button>
        )}
      </div>
    </Card>
  );
};
