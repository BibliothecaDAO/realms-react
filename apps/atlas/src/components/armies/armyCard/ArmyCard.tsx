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
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import {
  getRealmNameById,
  getRealmOrderById,
  getTravelTime,
} from '@/components/realms/RealmsGetters';
import { useAtlasContext } from '@/context/AtlasContext';
import { useCommandList } from '@/context/CommandListContext';
import type { Army } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { Entrypoints } from '@/hooks/settling/useTravel';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import { ArmyBattalions } from './ArmyBattalions';
import { ArmyStatistics } from './ArmyStatistics';

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

  console.log(army);

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

  const txQueue = useCommandList();

  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  useEffect(() => {
    setEnqueuedHarvestTx(
      !!txQueue.transactions.find(
        (t: any) =>
          t.contractAddress == ModuleAddr.Travel &&
          t.entrypoint == Entrypoints.travel &&
          t.calldata &&
          BigNumber.from(t.calldata[1] as string).eq(
            BigNumber.from(army.realmId)
          ) &&
          t.calldata[3] == army.armyId
      )
    );
  }, [txQueue.transactions]);

  return (
    <div
      key={army.armyId}
      className="flex-row p-3 border-4 rounded border-yellow-800/40"
    >
      <div className="">
        <div>
          <div className="flex justify-between">
            <div>
              <h3>
                {getRealmNameById(army.realmId)} | {army.realmId}
              </h3>
              <div className="flex mt-2 space-x-2">
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
                      size="sm"
                    >
                      Fly
                      {!isHome ? (
                        <span className="flex">
                          <OrderIcon
                            className="self-center mx-2"
                            size="xs"
                            order={
                              getRealmOrderById(army?.destinationRealmId) || ''
                            }
                          />{' '}
                          {getRealmNameById(army?.destinationRealmId)} -{' '}
                          {army?.destinationRealmId}
                        </span>
                      ) : (
                        'Home'
                      )}
                    </Button>
                  ))}
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
                    size="sm"
                    disabled={enqueuedHarvestTx}
                    onClick={() => props.onTravel && props.onTravel()}
                  >
                    {enqueuedHarvestTx ? (
                      'traveling'
                    ) : (
                      <span>
                        Travel here {'->'}{' '}
                        {(travelInformation.time / 60 / 60).toFixed(0)} hrs
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h5 className="flex">
                <span className="self-center">
                  {' '}
                  <OrderIcon
                    className="self-center mr-3"
                    size="xs"
                    order={army.orderType ? army.orderType.toLowerCase() : ''}
                  />{' '}
                </span>

                <span className="self-center">
                  {army.armyId == 0 ? 'Defending Army' : 'Army ' + army.armyId}
                </span>
              </h5>
            </div>
          </div>
          {hasArrived && (
            <div className="flex text-sm font-semibold rounded ">
              <CountdownTimer date={army?.destinationArrivalTime} /> ETA arrival
            </div>
          )}
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
