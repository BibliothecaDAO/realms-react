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
import toast from 'react-hot-toast';
import { Battalion } from '@/components/armies/squad/Battalion';
import { CostBlock } from '@/components/realms/RealmsGetters';
import {
  battalionInformation,
  defaultArmy,
  getUnitImage,
  battalionIdToString,
} from '@/constants/army';
import { MAX_BATTALIONS } from '@/constants/buildings';
import { useBankContext } from '@/context/BankContext';
import { useCommandList } from '@/context/CommandListContext';
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

type Props = {
  army?: Army;
  realm: GetRealmQuery['realm'];
  buildings?: number[];
  availableFood: number | undefined;
};

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

export const DefendingArmy = (props: Props) => {
  const { army, realm, buildings, availableFood } = props;

  const { play: buildTroop } = useUiSounds(soundSelector.buildMilitary);
  const { play: summonTroops } = useUiSounds(soundSelector.summonTroops);

  const { buildingIdsEnqueued } = useCurrentQueuedBuildings({
    moduleAddr: ModuleAddr.Building,
    entryPoint: Entrypoints.build,
    realmId: realm?.realmId,
  });

  const checkCanBuilt = (id) => {
    const militaryBuildings = buildings ?? [];
    return militaryBuildings.concat(buildingIdsEnqueued).filter((a) => a === id)
      .length > 0
      ? false
      : true;
  };

  const { build } = useCombat();
  const [activeBattalion, setActiveBattalion] = useState<BattalionInterface>();
  const [addedBattalions, setAddedBattalions] = useState<Battalion[]>([]);
  const [totalCost, setTotalCost] = useState<ResourceCost[]>();

  let blankArmy =
    props.realm.ownArmies.find((a) => a.armyId === 0) || defaultArmy;

  defaultArmy.realmId = props.realm.realmId;
  defaultArmy.armyId = 0; // defending Army

  const { battalions, getArmyStats, getArmyCost } = useArmy();

  const hasFood = availableFood && availableFood > 0;

  // TODO: move to composable
  if (!hasFood) {
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
          { ...filterArmytoQtys(army) }
        )
      );
    }
  }, [addedBattalions, army]);

  return (
    <div className="grid grid-cols-12 gap-6 pt-4">
      <div className="justify-between col-span-12">
        <h2>Defending Army</h2>
        <p className="text-lg text-gray-700">
          This Army will defend your Realm from threats. Make sure to keep it
          fed.
        </p>
      </div>
      <div className="col-span-8">
        <div className="grid w-full grid-cols-2 gap-4">
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
                  toast('Resources are added to the swap cart');
                }}
                quantity={blankArmy ? blankArmy[nameArray[index] + 'Qty'] : ''}
                health={blankArmy ? blankArmy[nameArray[index] + 'Health'] : ''}
                disabled={checkCanBuilt(battalion.buildingId)}
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
      <Card className="col-span-4">
        <CardTitle>
          {' '}
          Battalion Qty:{' '}
          {totalBattalionQty && sumTotalBattalions(totalBattalionQty)} /
          {MAX_BATTALIONS}
        </CardTitle>
        <CardBody className="justify-between">
          <div>
            <div className="grid w-full grid-cols-2 gap-1">
              {addedBattalions?.map((battalion, index) => (
                <div className="p-3 rounded bg-gray-1000" key={index}>
                  <h4>{battalionIdToString(battalion.battalionId)}</h4>
                  <CardBody>Qty: {battalion.battalionQty}</CardBody>

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
          <div className="mt-auto">
            <p className="mt-4 mb-4 text-xl">Total Cost</p>
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
                    toast('Resources are added to the swap cart');
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
        </CardBody>
      </Card>
      {/* <div className="relative col-span-5">
        <RadarMap armyOne={armyStats} height={400} width={400} />
      </div> */}
    </div>
  );
};
