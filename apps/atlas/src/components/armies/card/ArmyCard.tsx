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
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { Entrypoints } from '@/hooks/settling/useTravel';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import { armyLocation, hasArrived } from '../ArmyGetters';
import { ArmyBattalions } from './ArmyBattalions';
import { ArmyStatistics } from './ArmyStatistics';

type Prop = {
  army: ArmyAndOrder;
  onBuildArmy?: () => void;
  onTravel?: () => void;
  selectedRealm?: number;
};

export const ArmyCard: React.FC<Prop> = (props) => {
  const { army, onBuildArmy, onTravel, selectedRealm } = props;
  const [selectedTab, setSelectedTab] = useState(0);

  const { userRealms } = useUsersRealms();
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const { play } = useUiSounds(soundSelector.pageTurn);

  const travelInformation = getTravelTime({
    travellerId: armyLocation(army),
    destinationId: selectedRealm,
  });

  const isAtLocation = armyLocation(army) == selectedRealm;

  const isHome = [0, army.realmId].includes(army?.destinationRealmId);

  const isOwnRealm = userRealms?.realms.find((a) => a.realmId === army.realmId);

  const tabs = useMemo(
    () => [
      {
        label: <Map className="self-center w-3 h-3 fill-current" />,
        component: <ArmyStatistics army={army} />,
      },
      {
        label: <Head className="self-center w-3 h-3 fill-current" />,
        component: <ArmyBattalions army={army} />,
      },
    ],
    [isAtLocation, isHome, onTravel, onBuildArmy, army, selectedRealm]
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
      <div>
        <div className="flex justify-between">
          <div className="w-full">
            <div className="flex justify-between w-full pb-2 border-b border-white/20">
              <div>
                <h3>
                  {getRealmNameById(army.realmId)} | {army.realmId}
                </h3>
                {hasArrived(army) && (
                  <div className="flex text-sm font-semibold rounded ">
                    <CountdownTimer date={army?.destinationArrivalTime} /> ETA
                    arrival
                  </div>
                )}
              </div>

              <h5 className="flex">
                <span className="self-center">
                  {' '}
                  <OrderIcon
                    className="self-center mr-3"
                    size="xs"
                    order={army.orderType ? army.orderType.toLowerCase() : ''}
                  />{' '}
                </span>

                <span className="self-center p-1 px-4 border-b-2 rounded bg-gray-50/10 border-white/10">
                  {army.armyId == 0 ? 'Defending Army' : 'Army ' + army.armyId}
                </span>
              </h5>
            </div>

            <div className="flex mt-2 space-x-2">
              {army.armyId != 0 &&
                (isAtLocation ? (
                  <h5>{hasArrived(army) ? 'on the way' : 'here'}</h5>
                ) : (
                  <div>
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
                      {!isHome ? (
                        <span className="flex">
                          Fly{' '}
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
                        'Home Realm'
                      )}
                    </Button>
                  </div>
                ))}
              {isHome && isAtLocation && isOwnRealm && (
                <div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onBuildArmy && onBuildArmy()}
                  >
                    Build Army
                  </Button>
                </div>
              )}
              {onTravel && !isAtLocation && isOwnRealm && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={enqueuedHarvestTx}
                    onClick={() => onTravel && onTravel()}
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
                </div>
              )}
            </div>
          </div>
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
  );
};
