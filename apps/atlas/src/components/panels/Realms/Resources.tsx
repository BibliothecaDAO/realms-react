import {
  Button,
  Card,
  CardBody,
  CardStats,
  CardTitle,
  InputNumber,
  CountdownTimer,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import React, { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { RealmResources } from '@/components/tables/RealmResources';
import {
  RealmBuildingId,
  HarvestType,
  HARVEST_LENGTH,
  WORK_HUT_OUTPUT,
  WORK_HUT_COST,
  MAX_HARVESTS,
} from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { GetRealmQuery, Realm } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useBuildings, {
  createBuildingCall,
} from '@/hooks/settling/useBuildings';
import useFood, { createFoodCall } from '@/hooks/settling/useFood';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import { Entrypoints } from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import { getTrait } from '@/shared/Getters/Realm';
import TxAddedToQueueLabel from '@/shared/TxAddedToQueueLabel';
import type {
  BuildingDetail,
  RealmFoodDetails,
  AvailableResources,
} from '@/types/index';
import { BaseRealmDetailPanel } from './BaseRealmDetailPanel';

type Prop = {
  realm: GetRealmQuery;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  open: boolean;
  loading: boolean;
};

interface ResourceAndFoodInput {
  farmsToBuild: string;
  fishingVillagesToBuild: string;
  workHutsToBuild: string;
}

const Harvests: React.FC<Prop> = (props) => {
  const realm = props.realm?.realm;

  const { create, harvest } = useFood(realm as Realm);

  const isOwner = useIsOwner(realm?.settledOwner);

  const { getBuildingCostById } = useGameConstants();

  const txQueue = useTransactionQueue();

  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  const farmCapacity = getTrait(realm, 'River');
  const fishingVillageCapacity = getTrait(realm, 'Harbor');

  const [input, setInput] = useState<ResourceAndFoodInput>({
    farmsToBuild: '1',
    fishingVillagesToBuild: '1',
    workHutsToBuild: '1',
  });

  useEffect(() => {
    setEnqueuedHarvestTx(
      !!txQueue.transactions.find(
        (t) =>
          t.contractAddress == ModuleAddr.ResourceGame &&
          t.entrypoint == Entrypoints.claim &&
          t.calldata &&
          toBN(t.calldata[0]).eq(toBN(realm?.realmId))
      )
    );
    setInput({
      farmsToBuild: farmCapacity,
      fishingVillagesToBuild: fishingVillageCapacity,
      workHutsToBuild: '1',
    });
  }, [txQueue.transactions]);

  if (!realm) {
    return null;
  }

  return (
    <BaseRealmDetailPanel open={props.open}>
      <div className="grid grid-cols-12 gap-6 py-4">
        <Card className="col-span-12 md:col-start-1 md:col-end-4 ">
          <div className="w-full p-4 mx-auto bg-white rounded bg-opacity-90">
            <Image
              width={200}
              height={200}
              className={'w-72 h-72 mx-auto'}
              src={'/realm-buildings/hut.png'}
            />
          </div>

          <CardTitle>Work huts [labour]</CardTitle>

          <CardStats>
            <span className="text-4xl opacity-80">
              <span className="">
                {
                  props.buildings?.find((a) => a.name === 'House')
                    ?.quantityBuilt
                }
              </span>
            </span>
          </CardStats>
          <div className="p-2">
            {isOwner && (
              <div className="flex mt-2 space-x-2">
                <Button
                  onClick={() =>
                    txQueue.add(
                      createBuildingCall.build({
                        realmId: realm.realmId,
                        buildingId: RealmBuildingId.House,
                        qty: input.workHutsToBuild,
                      })
                    )
                  }
                  size="xs"
                  variant="primary"
                >
                  Build
                </Button>
                <InputNumber
                  value={input.workHutsToBuild}
                  inputSize="sm"
                  colorScheme="transparent"
                  className="w-12 bg-white border rounded border-white/40"
                  min={1}
                  max={10}
                  stringMode
                  onChange={(value: ValueType) =>
                    setInput({
                      farmsToBuild: input.farmsToBuild,
                      fishingVillagesToBuild: input.fishingVillagesToBuild,
                      workHutsToBuild: value.toString(),
                    })
                  }
                />{' '}
              </div>
            )}

            <p className="py-1">
              Workhuts increase your output by {WORK_HUT_OUTPUT} per day cycle.
              They cost {WORK_HUT_COST} of all the resources on your realm.
            </p>
          </div>
        </Card>
        <Card className="col-span-12 md:col-start-4 md:col-end-8 ">
          <CardTitle>Resources</CardTitle>
          <RealmResources showClaimable realm={realm} loading={false} />
        </Card>
      </div>
    </BaseRealmDetailPanel>
  );
};

export default Harvests;
