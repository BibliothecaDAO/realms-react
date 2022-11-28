import {
  Button,
  Card,
  CardStats,
  CardTitle,
  CountdownTimer,
  InputNumber,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import React, { useState, useEffect } from 'react';
import {
  RealmBuildingId,
  WORK_HUT_OUTPUT,
  WORK_HUT_COST,
  buildingIntegrity,
} from '@/constants/buildings';
import { findResourceById } from '@/constants/resources';
import { useCommandList } from '@/context/CommandListContext';
import type {
  GetRealmQuery,
  Realm,
  RealmFragmentFragment,
} from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { createBuildingCall } from '@/hooks/settling/useBuildings';
import useFood from '@/hooks/settling/useFood';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import { Entrypoints } from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import { getTrait } from '@/shared/Getters/Realm';
import type { BuildingDetail, RealmFoodDetails } from '@/types/index';

type Prop = {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
};

interface WorkHutInput {
  workHutsToBuild: string;
}

export const WorkHuts = (props) => {
  const realm = props.realm;

  const isOwner = useIsOwner(realm?.settledOwner);

  const { getBuildingCostById } = useGameConstants();

  const txQueue = useCommandList();

  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  const [input, setInput] = useState<WorkHutInput>({
    workHutsToBuild: '1',
  });

  useEffect(() => {
    setEnqueuedHarvestTx(
      !!txQueue.transactions.find(
        (t) =>
          t.contractAddress == ModuleAddr.ResourceGame &&
          t.entrypoint == Entrypoints.claim &&
          t.calldata &&
          BigNumber.from(t.calldata[0] as string).eq(
            BigNumber.from(realm?.realmId)
          )
      )
    );
    setInput({
      workHutsToBuild: '1',
    });
  }, [txQueue.transactions, realm?.realmId]);

  if (!realm) {
    return null;
  }

  const decay =
    props.buildings?.find((a) => a.name === 'House')?.buildingDecay || 0;

  return (
    <Card>
      <div className="flex w-full">
        <div className=" rounded">
          <Image
            width={200}
            height={200}
            className={'w-72 h-72 mx-auto rounded'}
            src={'/realm-buildings/mj_hut.png'}
            alt="Hut"
          />
        </div>

        <div className="p-2 ">
          <div className="bg-gradient-to-r from-gray-1100 via-red-900 to-gray-1100 pb-[2px] ">
            <h3 className=" p-1 shadow-xl shadow-red-700/20 px-2 flex bg-gray-1100">
              Workhuts{' '}
              <span className=" text-xs text-gray-700 self-center ml-4">
                {(
                  buildingIntegrity(RealmBuildingId.House) /
                  60 /
                  60 /
                  24
                ).toFixed(0)}{' '}
                Day Decay Time
              </span>
              <span className="self-center ml-auto text-sm flex">
                <span className="mr-2 text-gray-700 text-xs self-center">
                  Time till decay:
                </span>
                <CountdownTimer
                  date={(
                    (decay - buildingIntegrity(RealmBuildingId.House)) *
                    1000
                  ).toString()}
                />{' '}
              </span>
            </h3>
          </div>

          <div className="p-2 w-full">
            <div className="text-4xl opacity-80">
              <span className="">
                {
                  props.buildings?.find((a) => a.name === 'House')
                    ?.quantityBuilt
                }
              </span>
            </div>

            <div>
              <div className="flex mt-2 space-x-2">
                <Button
                  onClick={() =>
                    txQueue.add(
                      createBuildingCall.build({
                        realmId: realm.realmId,
                        buildingId: RealmBuildingId.House,
                        qty: input.workHutsToBuild,
                        costs: {
                          resources: realm.resources?.map((res) => ({
                            resourceId: res.resourceId,
                            resourceName: res.resourceName,
                            amount:
                              WORK_HUT_COST * parseInt(input.workHutsToBuild),
                          })),
                        },
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
                  onChange={(value: ValueType | null) => {
                    if (value) {
                      setInput({
                        workHutsToBuild: value.toString(),
                      });
                    }
                  }}
                />{' '}
              </div>
            </div>
            <div className="flex flex-wrap justify-center mt-4">
              {props.realm.resources?.map((re, index) => (
                <div key={index} className="flex flex-col justify-center p-2">
                  <ResourceIcon
                    resource={
                      findResourceById(re.resourceId)?.trait.replace(' ', '') ||
                      ''
                    }
                    size="sm"
                  />

                  <span className="self-center mt-2">
                    {WORK_HUT_COST} x {findResourceById(re.resourceId)?.trait}
                  </span>
                </div>
              ))}
            </div>
            <span className="py-1 bg-green-900 border-green-200 rounded p-2">
              Workhuts increase your output by {WORK_HUT_OUTPUT} per day cycle.
              They cost {WORK_HUT_COST} of all the resources on your realm.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
