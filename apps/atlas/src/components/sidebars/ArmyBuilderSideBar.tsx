import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputNumber,
  Table,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Image from 'next/image';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import React, { useState, useEffect } from 'react';
import { battalionInformation, defaultArmy } from '@/constants/army';
import type { Army } from '@/generated/graphql';
import { useArmy, nameArray } from '@/hooks/settling/useArmy';
import useCombat from '@/hooks/settling/useCombat';
import { CostBlock } from '@/shared/Getters/Realm';
import type {
  ArmyBattalionQty,
  BattalionInterface,
  ResourceCost,
} from '@/types/index';

type Prop = {
  army?: Army;
};

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

const MAX_BATTALIONS = 30;

export const Battalion: React.FC<
  BattalionInterface & { add: (id) => void; quantity; health }
> = (props) => {
  const data = battalionInformation.find((a) => a.id === props.battalionId);

  const [input, setInput] = useState('1');
  return (
    <Card
      key={props.battalionId}
      className={`relative flex-col group ${data?.color}`}
    >
      <div className="absolute flex flex-col justify-center invisible w-full h-full -m-3 transition-all bg-black cursor-pointer rounded-2xl opacity-90 group-hover:visible">
        <div className="flex self-center py-4">
          {props.battalionCost &&
            props.battalionCost.map((b, i) => {
              return (
                <CostBlock
                  key={i}
                  resourceName={b.resourceName}
                  amount={b.amount}
                  id={b.resourceId}
                  qty={input}
                />
              );
            })}
        </div>
        <div className="flex self-center space-x-3">
          <Button
            onClick={() =>
              props.add({
                battalionId: props.battalionId,
                battalionName: props.battalionName,
                battalionQty: input,
              })
            }
            variant="primary"
            size="xs"
            className="self-center"
          >
            add to army +
          </Button>
          <InputNumber
            value={input}
            inputSize="md"
            colorScheme="transparent"
            className="self-center w-12 h-full bg-white border rounded border-white/40"
            min={1}
            max={MAX_BATTALIONS}
            stringMode // to support high precision decimals
            onChange={(value: any) => setInput(value)}
          />{' '}
        </div>
      </div>
      <CardTitle className="flex justify-center text-center">
        {data?.name}
      </CardTitle>
      <CardBody>
        <div className="flex justify-center space-x-3 text-center">
          <div className="px-4 border-r">
            <h5 className="">qty</h5>
            <h1>{props.quantity}</h1>
          </div>
          <div className="pr-4">
            <h5 className="">health</h5>
            <h1>{props.health}</h1>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const ArmyBuilderSideBar: React.FC<Prop> = (props) => {
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
              key={index}
            >
              <Battalion
                {...battalion}
                add={(value) =>
                  setAddedBattalions((current) => {
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
              />
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-5">
        <Card className={`card ${activeBattalionData?.color}`}>
          <Image
            className="rounded-xl"
            src={activeBattalionData?.image ? activeBattalionData.image : ''}
            width={400}
            height={400}
            objectFit={'cover'}
          />
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
        <CardTitle>Adding Battalions to build</CardTitle>
        <CardBody className="justify-between">
          <div>
            <div className="text-xl">
              Battalion Qty:
              {totalBattalionQty && sumTotalBattalions(totalBattalionQty)} /
              {MAX_BATTALIONS}
            </div>
            <div className="grid w-full grid-cols-2 gap-4">
              {addedBattalions?.map((battalion, index) => (
                <Card className="" key={index}>
                  <CardTitle>{battalion.battalionName} </CardTitle>
                  <CardBody>Battalions: {battalion.battalionQty}</CardBody>

                  <Button
                    size="xs"
                    variant="primary"
                    onClick={() => removeFromArray(index)}
                  >
                    remove
                  </Button>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xl uppercase">Total Cost</p>
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
            build(
              army?.realmId,
              army?.armyId,
              addedBattalions.map((a) => a.battalionId),
              addedBattalions.map((a) => a.battalionQty)
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
