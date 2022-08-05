import {
  Card,
  CardTitle,
  CardStats,
  Button,
} from '@bibliotheca-dao/ui-lib/base';
import React from 'react';
import { RealmBuildingId } from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { GetRealmQuery } from '@/generated/graphql';
import { createFoodCall } from '@/hooks/settling/useFood';

type Prop = {
  realm?: GetRealmQuery;
};

const getTrait = (realm: any, trait: string) => {
  return realm?.traits?.find((o) => o.type === trait)
    ? realm.traits?.find((o) => o.type === trait).qty
    : '0';
};

const Food: React.FC<Prop> = (props) => {
  const realm = props.realm?.realm;
  const getFood = () => {
    return realm?.buildings
      ?.map((a) => a.food)
      .reduce((prev, curr) => prev + curr, 0);
  };

  const farmCapacity = getTrait(realm, 'River');
  const fishingVillageCapacity = getTrait(realm, 'Harbor');

  const txQueue = useTransactionQueue();

  return (
    <>
      <Card className="col-start-4 col-end-5 ">
        <CardTitle>Food</CardTitle>
        <CardStats className="text-4xl">{getFood()}</CardStats>
      </Card>
      <Card>
        <CardTitle>Farms</CardTitle>
        <p>Capacity {farmCapacity}</p>
        <Button
          onClick={() => {
            txQueue.add(
              createFoodCall.create({
                tokenId: realm?.realmId,
                quantity: 1,
                foodBuildingId: RealmBuildingId.Farm,
              })
            );
          }}
          variant="primary"
        >
          Build
        </Button>
      </Card>
      <Card>
        <CardTitle>Fishing Villages</CardTitle>
        <p>Capacity {fishingVillageCapacity}</p>
        <Button
          onClick={() => {
            txQueue.add(
              createFoodCall.create({
                tokenId: realm?.realmId,
                quantity: 1,
                foodBuildingId: RealmBuildingId.FishingVillage,
              })
            );
          }}
          variant="primary"
        >
          Build
        </Button>
      </Card>
    </>
  );
};

export default Food;
