import {
  Button,
  Card,
  CountdownTimer,
  OrderIcon,
  Tabs,
} from '@bibliotheca-dao/ui-lib/base';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import { useMemo, useState } from 'react';
import {
  getRealmNameById,
  getTravelTime,
} from '@/components/realms/RealmsGetters';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army } from '@/generated/graphql';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
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
  const { userRealms } = useUsersRealms();

  const army = props.army;

  const { play } = useUiSounds(soundSelector.pageTurn);
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();

  const armyLocation =
    army.destinationRealmId == 0 ? army.realmId : army.destinationRealmId;

  const travelInformation = getTravelTime({
    travellerId: armyLocation,
    destinationId: props.selectedRealm,
  });

  // bools
  const isAtLocation = armyLocation == props.selectedRealm;
  const hasArrived = army?.destinationArrivalTime > new Date().getTime();
  const isHome = [0, army.realmId].includes(army?.destinationRealmId);

  const isOwnRealm = userRealms?.realms.find(
    (a) => a.realmId === props.army.realmId
  );

  const tabs = useMemo(
    () => [
      {
        label: <Map className="self-center w-3 h-3 fill-current" />,
        component: <ArmyStatistics army={props.army} />,
      },
      {
        label: <Head className="self-center w-3 h-3 fill-current" />,
        component: <ArmyBattalions army={props.army} />,
      },
    ],
    [
      isAtLocation,
      isHome,
      props.onTravel,
      props.onBuildArmy,
      props.army,
      props.selectedRealm,
    ]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <div
      key={army.armyId}
      className="flex-row p-3 border border-yellow-900 rounded"
    >
      <div className="">
        <div>
          <div className="flex justify-between">
            <h3>
              {getRealmNameById(army.realmId)} | {army.realmId}
            </h3>
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
                    className="w-full"
                  >
                    <Globe className="w-3 mr-2 fill-current" />
                    current location -{' '}
                    {!isHome ? army?.destinationRealmId : 'Home'}
                  </Button>
                ))}
            </div>
            <h5 className="flex">
              <OrderIcon
                className="self-center mr-3"
                size="xs"
                order={army.orderType ? army.orderType.toLowerCase() : ''}
              />{' '}
              {army.armyId == 0 ? 'Defending Army' : 'Army ' + army.armyId}
            </h5>
          </div>
          {hasArrived && (
            <div className="flex text-sm font-semibold rounded ">
              <CountdownTimer date={army?.destinationArrivalTime} /> ETA arrival
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 my-2">
            {isHome && isAtLocation && isOwnRealm && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => props.onBuildArmy && props.onBuildArmy()}
              >
                Build Army
              </Button>
            )}
            {props.onTravel && !isAtLocation && isOwnRealm && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => props.onTravel && props.onTravel()}
              >
                Travel here {'->'}{' '}
                {(travelInformation.time / 60 / 60).toFixed(0)} hrs
              </Button>
            )}
          </div>
        </div>
        <div className="w-full h-full">
          <div className="flex justify-between mb-2"></div>
          <Tabs
            selectedIndex={selectedTab}
            onChange={(index) => pressedTab(index as number)}
            variant="small"
          >
            <Tabs.List className="">
              {tabs.map((tab, index) => (
                <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
              ))}
            </Tabs.List>

            <Tabs.Panels>
              {tabs.map((tab, index) => (
                <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
              ))}
            </Tabs.Panels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
