import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Image from 'next/image';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import React, { useState } from 'react';
import { battalionInformation } from '@/constants/army';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';
import useCombat from '@/hooks/settling/useCombat';
import type { ArmyInterface, BattalionInterface } from '@/types/index';

type Prop = {
  army?: Army;
};

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

const MAX_BATTALIONS = 23;

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
      <div className="absolute flex justify-center invisible w-full h-full -m-3 transition-all bg-black cursor-pointer rounded-2xl opacity-90 group-hover:visible">
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
        {props.battalionName}
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
  const [activeBattalion, setActiveBattalion] = useState<Battalion>();
  const [addedBattalions, setAddedBattalions] = useState<Battalion[]>([]);

  const army = props.army;
  const { battalions, getArmyStats } = useArmy();

  const activeBattalionData = battalionInformation.find(
    (a) => a.id === activeBattalion?.battalionId
  );

  const removeFromArray = (index) => {
    setAddedBattalions([
      ...addedBattalions.slice(0, index),
      ...addedBattalions.slice(index + 1),
    ]);
  };

  const armyStats = getArmyStats(props.army);

  // TODO hack around mix between camel and sentence case names
  const nameArray = [
    'lightCavalry',
    'heavyCavalry',
    'archer',
    'longbow',
    'mage',
    'arcanist',
    'lightInfantry',
    'heavyInfantry',
  ];

  return (
    <div className="grid grid-cols-12 gap-6 pt-10">
      <div className="col-span-12">
        <h2>Realm {army?.realmId}</h2>
        <h4>
          Army #{army?.armyId} | Location:{' '}
          {army?.visitingRealmId != 0 ? army?.visitingRealmId : 'Home Realm'}
        </h4>
      </div>
      <div className="col-span-7">
        <div className="grid w-full grid-cols-2 gap-4">
          {battalions?.map((battalion, index) => (
            <div
              onMouseEnter={() =>
                setActiveBattalion({
                  battalionId: battalion.battalionId,
                  battalionName: battalion.battalionName,
                  battalionQty: 1,
                })
              }
              key={index}
            >
              <Battalion
                {...battalion}
                add={(value) =>
                  setAddedBattalions((current) => [...current, value])
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
            className="rounded-xl "
            src={activeBattalionData?.image ? activeBattalionData.image : ''}
            width={400}
            height={400}
          />
          <div className="p-3">
            <h2>{activeBattalion?.battalionName}</h2>
          </div>

          <CardBody>{activeBattalionData?.description}</CardBody>
        </Card>
      </div>
      <Card className="col-span-7">
        <CardTitle>Adding Battalions to build</CardTitle>
        <CardBody>
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
        >
          muster the battalions
        </Button>
      </div>
    </div>
  );
};
