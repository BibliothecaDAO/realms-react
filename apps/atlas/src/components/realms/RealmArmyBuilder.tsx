import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';
import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Battalion } from '@/components/armies/squad/Battalion';
import { CostBlock, resourcePillaged } from '@/components/realms/RealmsGetters';
import {
  battalionInformation,
  defaultArmy,
  getUnitImage,
  battalionIdToString,
} from '@/constants/army';
import { buildingIdToString, MAX_BATTALIONS } from '@/constants/globals';
import { useBankContext } from '@/context/BankContext';
import { useCommandList } from '@/context/CommandListContext';
import { useUIContext } from '@/context/UIContext';
import type { Army, GetRealmQuery } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { useArmy, nameArray } from '@/hooks/settling/useArmy';
import { Entrypoints } from '@/hooks/settling/useBuildings';
import useCombat from '@/hooks/settling/useCombat';
import { useCurrentQueuedBuildings } from '@/hooks/settling/useCurrentQueuedBuildings';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import type {
  ArmyBattalionQty,
  BattalionInterface,
  ResourceCost,
} from '@/types/index';
import { realmMilitaryEvents } from '@/types/index';
import { HistoryCard } from './HistoryCard';
type Props = {
  army?: Army;
  armyId: number;
  realm: GetRealmQuery['realm'];
  buildings?: number[];
  availableFood: number | undefined;
  defendHistory?: any;
};

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

export const ArmyBuilder = (props: Props) => {
  const { army, armyId, realm, buildings, availableFood } = props;

  const { play: buildTroop } = useUiSounds(soundSelector.buildMilitary);
  const { play: summonTroops } = useUiSounds(soundSelector.summonTroops);

  const { buildingIdsEnqueued } = useCurrentQueuedBuildings({
    moduleAddr: ModuleAddr.Building,
    entryPoint: Entrypoints.build,
    realmId: realm?.realmId,
  });

  const { build } = useCombat();
  const [activeBattalion, setActiveBattalion] = useState<BattalionInterface>();
  const [addedBattalions, setAddedBattalions] = useState<Battalion[]>([]);
  const [totalCost, setTotalCost] = useState<ResourceCost[]>();

  // set Army or Blank
  let blankArmy = army ?? defaultArmy;

  defaultArmy.realmId = props.realm.realmId;
  defaultArmy.armyId = armyId; // defending Army

  const { battalions, getArmyStats, getArmyCost } = useArmy();

  // dirty
  const hasFood = true;

  // TODO: move to composable
  if (!hasFood && army) {
    blankArmy = {
      arcanistHealth: blankArmy.arcanistHealth / 2,
      arcanistQty: blankArmy.arcanistQty,
      archerHealth: blankArmy.archerHealth / 2,
      archerQty: blankArmy.arcanistQty / 2,
      armyId: blankArmy.armyId,
      armyPacked: blankArmy.armyPacked,
      callSign: blankArmy.callSign,
      destinationRealmId: blankArmy.destinationRealmId,
      heavyCavalryHealth: blankArmy.heavyCavalryHealth / 2,
      heavyCavalryQty: blankArmy.heavyCavalryQty,
      heavyInfantryHealth: blankArmy.heavyInfantryHealth / 2,
      heavyInfantryQty: blankArmy.heavyInfantryQty,
      lastAttacked: blankArmy.lastAttacked,
      level: blankArmy.level,
      lightCavalryHealth: blankArmy.lightCavalryHealth / 2,
      lightCavalryQty: blankArmy.lightCavalryQty,
      lightInfantryHealth: blankArmy.lightInfantryHealth / 2,
      lightInfantryQty: blankArmy.lightInfantryQty,
      longbowHealth: blankArmy.longbowHealth / 2,
      longbowQty: blankArmy.longbowQty,
      mageHealth: blankArmy.mageHealth / 2,
      mageQty: blankArmy.mageQty,
      realmId: blankArmy.realmId,
      xp: blankArmy.xp,
    };
  }

  const { batchAddResources } = useBankContext();

  const activeBattalionData = battalionInformation.find(
    (a) => a.id === activeBattalion?.battalionId
  );

  const removeFromArray = (index) => {
    setAddedBattalions([
      ...addedBattalions.slice(0, index),
      ...addedBattalions.slice(index + 1),
    ]);
  };

  const filterArmytoQtys = (army) => {
    return (
      army &&
      (Object.keys(army)
        .filter((key) => key.includes('Qty'))
        .reduce((cur, key) => {
          return Object.assign(cur, { [key]: army[key] });
        }, {}) as ArmyBattalionQty)
    );
  };

  const battalionQtys: ArmyBattalionQty = filterArmytoQtys(defaultArmy);
  const [totalBattalionQty, setTotalBattalionQty] =
    useState<ArmyBattalionQty>(battalionQtys);

  const mapBattalionsToArmyQtys = (
    battalions: Battalion[]
  ): ArmyBattalionQty => {
    const reMapped = {};
    battalions.forEach((b) => {
      reMapped[
        b.battalionName.charAt(0).toLowerCase() +
          b.battalionName.slice(1) +
          'Qty'
      ] = Number(b.battalionQty);
    });
    return { ...battalionQtys, ...reMapped };
  };

  const armyStats = getArmyStats(army);
  const { toggleTrade } = useUIContext();
  const sumTotalBattalions = (armyQtys: ArmyBattalionQty) =>
    Object.values(armyQtys).reduce((a, b) => a + b);

  const maxBattalionQtyReached = useMemo(() => {
    return (
      totalBattalionQty &&
      sumTotalBattalions(totalBattalionQty) >= MAX_BATTALIONS
    );
  }, [totalBattalionQty]);

  const checkCanBuilt = (id) => {
    const militaryBuildings = buildings ?? [];
    return militaryBuildings.concat(buildingIdsEnqueued).filter((a) => a === id)
      .length > 0 && !maxBattalionQtyReached
      ? false
      : true;
  };

  const getDisabledReason = (id) => {
    return !maxBattalionQtyReached
      ? `! Build a ${buildingIdToString(id || 0)} First`
      : `! Max Battalion Qty Reached`;
  };

  const summonDisabled = () => {
    return !addedBattalions.length;
  };

  useEffect(() => {
    if (addedBattalions) {
      const mappedBattalions = mapBattalionsToArmyQtys(addedBattalions);
      setTotalCost(getArmyCost(mappedBattalions));
      setTotalBattalionQty(
        Object.entries(mappedBattalions).reduce(
          (acc, [k, v]) => {
            acc[k] = (acc[k] || 0) + v;
            return acc;
          },
          { ...filterArmytoQtys(army) }
        )
      );
    }
  }, [addedBattalions, army]);

  return (
    <div className="grid grid-cols-12 gap-6 pt-4">
      <div className="col-span-8">
        <div className="grid w-full grid-cols-1 gap-4">
          {battalions?.map((battalion, index) => (
            <div
              onMouseEnter={() =>
                setActiveBattalion({
                  ...battalion,
                })
              }
              key={blankArmy?.realmId + '-' + index}
            >
              <Battalion
                {...battalion}
                show
                add={(value) =>
                  setAddedBattalions((current) => {
                    buildTroop();
                    if (
                      current.find((b) => b.battalionId === value.battalionId)
                    ) {
                      // eslint-disable-next-line sonarjs/no-ignored-return
                      return addedBattalions.map((object) => {
                        if (object.battalionId === value.battalionId) {
                          return {
                            ...object,
                            battalionQty:
                              Number(object.battalionQty) +
                              Number(value.battalionQty),
                          };
                        } else return object;
                      });
                    } else return [...current, value];
                  })
                }
                addResources={(qty) => {
                  batchAddResources(
                    battalion.battalionCost
                      .filter((r) => r.amount > 0)
                      .map((r) => ({
                        resourceId: r.resourceId,
                        resourceName: r.resourceName,
                        amount: r.amount * qty,
                      }))
                  );
                  toast(
                    <span>
                      Missing resources added to the cart
                      <Button onClick={toggleTrade}>Open Now</Button>
                    </span>
                  );
                }}
                quantity={blankArmy ? blankArmy[nameArray[index] + 'Qty'] : ''}
                health={blankArmy ? blankArmy[nameArray[index] + 'Health'] : ''}
                disabled={checkCanBuilt(battalion.buildingId)}
                disabledReason={getDisabledReason(battalion.buildingId)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* <div className="col-span-4">
          <div className={`card ${activeBattalionData?.color}`}>
            {activeBattalionData?.id && (
              <>
                <Image
                  className="rounded-xl"
                  src={getUnitImage(activeBattalionData.id)}
                  width={400}
                  height={400}
                  alt=""
                  objectFit={'cover'}
                />
  
                <div className="p-3">
                  <h2> {battalionIdToString(activeBattalionData?.id)}</h2>
  
                  <h5>Strong vs {activeBattalionData?.strength}</h5>
                  <h5>Weak vs {activeBattalionData?.weakness}</h5>
                </div>
              </>
            )}
            <p className="px-4 text-xl">{activeBattalionData?.description}</p>
            <CardBody>
              <div className="text-xl font-display">
                <div className="flex justify-between">
                  Attack Points{' '}
                  <span className="text-2xl">{activeBattalion?.attack}</span>{' '}
                </div>{' '}
                <div className="flex justify-between">
                  Cavalry Defence{' '}
                  <span className="text-2xl">
                    {activeBattalion?.cavalryDefence}
                  </span>
                </div>{' '}
                <div className="flex justify-between">
                  Archery Defence{' '}
                  <span className="text-2xl">
                    {activeBattalion?.archeryDefence}
                  </span>
                </div>{' '}
                <div className="flex justify-between">
                  Magic Defence{' '}
                  <span className="text-2xl">
                    {activeBattalion?.magicDefence}
                  </span>
                </div>{' '}
                <div className="flex justify-between">
                  Infantry Defence{' '}
                  <span className="text-2xl">
                    {activeBattalion?.infantryDefence}
                  </span>
                </div>
                {activeBattalion && (
                  <div className="flex justify-between">
                    Total Defence{' '}
                    <span className="text-2xl">
                      {activeBattalion?.infantryDefence +
                        activeBattalion?.magicDefence +
                        activeBattalion?.archeryDefence +
                        activeBattalion?.cavalryDefence}
                    </span>
                  </div>
                )}
              </div>
            </CardBody>
          </div>
        </div> */}
      <div className="sticky flex flex-col h-auto col-span-4">
        <CardTitle>
          {' '}
          Battalion Qty:{' '}
          {totalBattalionQty && sumTotalBattalions(totalBattalionQty)} /
          {MAX_BATTALIONS}
        </CardTitle>
        <CardBody className="">
          <div>
            <div className="grid w-full grid-cols-2 gap-1">
              {addedBattalions?.map((battalion, index) => (
                <div
                  className="p-3 border border-yellow-900 rounded"
                  key={index}
                >
                  <h5>{battalionIdToString(battalion.battalionId)}</h5>
                  <div className="flex mb-4">
                    Qty:{' '}
                    <Button
                      size="xs"
                      variant="outline"
                      className="px-2 mx-2"
                      onClick={() => {
                        if (battalion.battalionQty == 1) {
                          removeFromArray(index);
                        } else {
                          setAddedBattalions((current) => {
                            return current.map((object) => {
                              if (
                                object.battalionId === battalion.battalionId
                              ) {
                                return {
                                  ...object,
                                  battalionQty: Number(object.battalionQty) - 1,
                                };
                              } else return object;
                            });
                          });
                        }
                      }}
                    >
                      -
                    </Button>
                    {battalion.battalionQty}
                    <Button
                      size="xs"
                      variant="outline"
                      className="px-2 mx-2"
                      disabled={maxBattalionQtyReached}
                      onClick={() =>
                        setAddedBattalions((current) => {
                          return current.map((object) => {
                            if (object.battalionId === battalion.battalionId) {
                              return {
                                ...object,
                                battalionQty: Number(object.battalionQty) + 1,
                              };
                            } else return object;
                          });
                        })
                      }
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    size="xs"
                    variant="outline"
                    className="w-full"
                    onClick={() => removeFromArray(index)}
                  >
                    remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <p className="mt-4 mb-4 text-xl">Total Cost in Resources</p>
            <div className="flex flex-wrap">
              {totalCost?.length &&
                totalCost.map((b, i) => {
                  if (b.amount != 0) {
                    return (
                      <CostBlock
                        key={i}
                        resourceName={b.resourceName}
                        amount={b.amount}
                        id={b.resourceId}
                        qty={1}
                      />
                    );
                  }
                })}
              {totalCost?.length && (
                <Button
                  onClick={() => {
                    batchAddResources(
                      totalCost
                        .filter((r) => r.amount > 0)
                        .map((r) => ({
                          resourceId: r.resourceId,
                          resourceName: r.resourceName,
                          amount: r.amount,
                        }))
                    );
                    toast(
                      <span>
                        Missing resources added to the cart
                        <Button onClick={toggleTrade}>Open Now</Button>
                      </span>
                    );
                  }}
                  size="xs"
                  className="ml-2"
                  variant="outline"
                >
                  Buy Resources
                </Button>
              )}
            </div>
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={() => {
                summonTroops();
                build(
                  blankArmy?.realmId,
                  blankArmy?.armyId,
                  addedBattalions.map((a) => a.battalionId),
                  addedBattalions.map((a) => a.battalionQty),
                  totalCost?.filter((b) => b.amount > 0)
                );
                setAddedBattalions(() => []);
              }}
              variant="primary"
              size="sm"
              disabled={summonDisabled()}
            >
              summon the battalions
            </Button>
          </div>
          {/* {props.defendHistory &&
            props.defendHistory.map((a, index) => {
              return (
                <div key={index} className="mt-8">
                  <h3 className="mb-4">Raids on Realm</h3>
                  <HistoryCard
                    realmId={a.realmId}
                    timeStamp={a.timestamp}
                    eventId={a.eventId}
                    event={`Raided by Realm ${a.data.attackRealmId}`}
                    action={''}
                  >
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
                  </HistoryCard>
                </div>
              );
            })} */}
        </CardBody>
      </div>
      {/* <div className="relative col-span-5">
          <RadarMap armyOne={armyStats} height={400} width={400} />
        </div> */}
    </div>
  );
};
