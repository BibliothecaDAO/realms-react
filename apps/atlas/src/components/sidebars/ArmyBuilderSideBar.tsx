import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import {
  battalionIdToString,
  battalionInformation,
  defaultArmy,
} from '@/constants/army';
import { useCommandList } from '@/context/CommandListContext';
import type { Army } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { useArmy, nameArray } from '@/hooks/settling/useArmy';
import { Entrypoints } from '@/hooks/settling/useBuildings';
import useCombat from '@/hooks/settling/useCombat';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { CostBlock } from '@/shared/Getters/Realm';
import { Battalion } from '@/shared/squad/Battalion';
import type {
  ArmyBattalionQty,
  BattalionInterface,
  ResourceCost,
} from '@/types/index';
type Prop = {
  army?: Army;
  buildings?: number[];
};

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

const MAX_BATTALIONS = 30;

export const ArmyBuilderSideBar: React.FC<Prop> = (props) => {
  const { play: buildTroop } = useUiSounds(soundSelector.buildMilitary);
  const { play: summonTroops } = useUiSounds(soundSelector.summonTroops);
  const txQueue = useCommandList();
  const [buildingIdsEnqueued, setBuildingIdsEnqueued] = useState<number[]>([]);
  useEffect(() => {
    console.log(txQueue.transactions);
    setBuildingIdsEnqueued(
      txQueue.transactions
        .filter(
          (tx) =>
            tx.contractAddress == ModuleAddr.Building &&
            tx.entrypoint == Entrypoints.build &&
            tx.metadata['realmId'] == props.army?.realmId
        )
        .map((t) => t.metadata['buildingId'])
    );
  }, [txQueue.transactions]);

  const checkCanBuilt = (id) => {
    const militaryBuildings = props.buildings ?? [];
    return militaryBuildings.concat(buildingIdsEnqueued).filter((a) => a === id)
      .length > 0
      ? false
      : true;
  };

  console.log(buildingIdsEnqueued);

  const { build } = useCombat();
  const [activeBattalion, setActiveBattalion] = useState<BattalionInterface>();
  const [addedBattalions, setAddedBattalions] = useState<Battalion[]>([]);
  const [totalCost, setTotalCost] = useState<ResourceCost[]>();

  const army = props.army;
  const { battalions, getArmyStats, getArmyCost } = useArmy();

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
  /* addedBattalions.map((battalion) => {
    return { [battalion.battalionName + 'qty']: battalion.battalionQty };
  }); */

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

  const armyStats = getArmyStats(props.army);

  const sumTotalBattalions = (armyQtys: ArmyBattalionQty) =>
    Object.values(armyQtys).reduce((a, b) => a + b);

  const summonDisabled = () => {
    return (
      sumTotalBattalions(totalBattalionQty) > MAX_BATTALIONS ||
      !addedBattalions.length
    );
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
          { ...filterArmytoQtys(props.army) }
        )
      );
    }
  }, [addedBattalions, props.army]);

  return (
    <div className="grid grid-cols-12 gap-6 pt-4">
      <hr />
      <div className="flex justify-between col-span-12">
        <h2>
          {army?.armyId == 0 ? 'Defending Army' : ' Army ' + army?.armyId}{' '}
        </h2>
        <Button variant="outline">
          {' '}
          <Globe className="w-4 mr-4 fill-current" />
          {army?.destinationRealmId != 0
            ? army?.destinationRealmId
            : 'Home Realm'}
        </Button>
      </div>
      <div className="col-span-7">
        <div className="grid w-full grid-cols-2 gap-4">
          {battalions?.map((battalion, index) => (
            <div
              onMouseEnter={() =>
                setActiveBattalion({
                  ...battalion,
                })
              }
              key={army?.realmId + '-' + index}
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
                quantity={army ? army[nameArray[index] + 'Qty'] : ''}
                health={army ? army[nameArray[index] + 'Health'] : ''}
                disabled={checkCanBuilt(battalion.buildingId)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-5">
        <Card className={`card ${activeBattalionData?.color}`}>
          {activeBattalionData?.image && (
            <Image
              className="rounded-xl"
              src={activeBattalionData?.image}
              width={400}
              height={400}
              objectFit={'cover'}
            />
          )}
          <div className="p-3">
            <h2>{activeBattalionData?.name}</h2>

            <h5>Strong vs {activeBattalionData?.strength}</h5>
            <h5>Weak vs {activeBattalionData?.weakness}</h5>
          </div>
          {/* <p className="px-4 text-xl">{activeBattalionData?.description}</p> */}
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
        </Card>
      </div>
      <Card className="col-span-7">
        <CardTitle>
          {' '}
          Battalion Qty:{' '}
          {totalBattalionQty && sumTotalBattalions(totalBattalionQty)} /
          {MAX_BATTALIONS}
        </CardTitle>
        <CardBody className="justify-between">
          <div>
            <div className="grid w-full grid-cols-3 gap-2">
              {addedBattalions?.map((battalion, index) => (
                <div className="p-2 rounded bg-gray-1000" key={index}>
                  <CardTitle>
                    {battalionIdToString(battalion.battalionId)}
                  </CardTitle>
                  <CardBody>Qty: {battalion.battalionQty}</CardBody>

                  <Button
                    size="xs"
                    variant="primary"
                    onClick={() => removeFromArray(index)}
                  >
                    remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-xl font-display">Total Cost</p>
            <div className="flex">
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
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="relative col-span-5">
        <RadarMap armyOne={armyStats} height={400} width={400} />
      </div>
      <div className="col-span-5">
        <Button
          onClick={() => {
            summonTroops();
            build(
              army?.realmId,
              army?.armyId,
              addedBattalions.map((a) => a.battalionId),
              addedBattalions.map((a) => a.battalionQty),
              totalCost
            );
            setAddedBattalions(() => []);
          }}
          variant="primary"
          size="lg"
          disabled={summonDisabled()}
        >
          summon the battalions
        </Button>
      </div>
    </div>
  );
};
