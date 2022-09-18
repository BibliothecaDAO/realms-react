import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Image from 'next/image';
import React, { useState } from 'react';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';
import SquadStatistics from '@/shared/squad/SquadStatistics';
import type { ArmyInterface } from '@/types/index';

type Prop = {
  army?: Army;
};

type Battalion = {
  battalionId: number;
  battalionName: string;
};

const blankB = { battalionId: 1, battalionName: 'sss' };

export const Battalion: React.FC<
  ArmyInterface & { add: (id) => void; quantity; health }
> = (props) => {
  return (
    <Card key={props.battalionId} className="relative flex-col group">
      {/* <div className="absolute flex justify-center invisible w-full h-full -m-3 transition-all bg-black cursor-pointer rounded-3xl opacity-90 group-hover:visible">
        <Button
          onClick={() =>
            props.add({
              battalionId: props.battalionId,
              battalionName: props.battalionName,
            })
          }
          variant="outline"
          className="self-center"
        >
          add to army +
        </Button>
      </div> */}
      <CardTitle>{props.battalionName}</CardTitle>
      <CardBody>
        <div>Battlions: {props.quantity}</div>
        <div>Battlion Health: {props.health}</div>
        <div>
          <h5>Strong vs Archers</h5>
        </div>
      </CardBody>
    </Card>
  );
};

const test = [
  {
    taste: 'fruity',
    chardonay: 82,
    carmenere: 32,
    syrah: 117,
  },
  {
    taste: 'bitter',
    chardonay: 66,
    carmenere: 43,
    syrah: 55,
  },
  {
    taste: 'heavy',
    chardonay: 53,
    carmenere: 93,
    syrah: 58,
  },
  {
    taste: 'strong',
    chardonay: 102,
    carmenere: 114,
    syrah: 36,
  },
  {
    taste: 'sunny',
    chardonay: 100,
    carmenere: 66,
    syrah: 83,
  },
];

export const ArmyBuilderSideBar: React.FC<Prop> = (props) => {
  const [activeBattalion, setActiveBattalion] = useState<Battalion>(blankB);
  const [addedBattalions, setAddedBattalions] = useState<Battalion[]>([]);

  const army = props.army;
  const { armyBattalions } = useArmy();

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7">
        <h2>Realm {army?.realmId}</h2>
        <h4>
          Army #{army?.armyId} | Location:{' '}
          {army?.visitingRealmId != 0 ? army?.visitingRealmId : 'Home Realm'}
        </h4>

        <div className="grid w-full grid-cols-2 gap-4">
          {armyBattalions?.map((battalion, index) => (
            <div
              onMouseEnter={() =>
                setActiveBattalion({
                  battalionId: battalion.battalionId,
                  battalionName: battalion.battalionName,
                })
              }
              key={index}
            >
              <Battalion
                {...battalion}
                add={(value) =>
                  setAddedBattalions((current) => [...current, value])
                }
                quantity={army ? army[battalion.battalionName + 'Qty'] : ''}
                health={army ? army[battalion.battalionName + 'Health'] : ''}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-5">
        <Card className="">
          <Image
            className="rounded-xl"
            src={'/stableai/paladin.jpeg'}
            width={400}
            height={400}
          />
          <CardTitle>{activeBattalion.battalionName}</CardTitle>
          <CardBody>
            <p>
              Paladins are the most loyal and talented horseback riders that
              exist. With their superior horsemanship skills, they are able to
              wield a lance or polearm effectively with just one hand, allowing
              them to use their other hand to carry a shield or sheathe a
              weapon. As well as being proficient with most weapons and
              protective armor, Paladins are also highly skilled at defensive
              maneuvers while mounted.
            </p>
          </CardBody>
        </Card>
      </div>
      <Card className="col-span-7">
        <CardTitle>Adding Battalions to build</CardTitle>
        <CardBody>
          <div className="grid w-full grid-cols-2 gap-4">
            {addedBattalions?.map((battalion, index) => (
              <div key={index}>{battalion.battalionId}</div>
              // <Battalion
              //   {...battalion}
              //   key={index}
              //   add={(value) => setAddedBattalions(value)}
              //   quantity={army ? army[battalion.battalionName + 'Qty'] : ''}
              //   health={army ? army[battalion.battalionName + 'Health'] : ''}
              // />
            ))}
          </div>
        </CardBody>
      </Card>
      <div className="relative col-span-5 rounded-xl">
        <RadarMap width={400} height={400} />
      </div>
      <div className="col-span-5">
        <Button variant="primary" size="lg">
          muster the battalions
        </Button>
      </div>
    </div>
  );
};
