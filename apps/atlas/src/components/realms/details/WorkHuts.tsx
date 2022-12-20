import {
  Button,
  Card,
  CardStats,
  CardTitle,
  CountdownTimer,
  InputNumber,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';
import type { ValueType } from '@rc-component/mini-decimal';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getTrait } from '@/components/realms/RealmsGetters';
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
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
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

  const txQueue = useCommandList();

  const { play: buildWorkHut } = useUiSounds(soundSelector.buildWorkHut);

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

  const decay =
    props.buildings?.find((a) => a.name === 'House')?.buildingDecay || 0;

  const built =
    props.buildings?.find((a) => a.name === 'House')?.quantityBuilt || 0;

  return (
    <div className="flex border-4 border-yellow-900/40 rounded-2xl">
      <div className="flex w-full">
        <div className="relative w-1/2">
          <img
            className={' mx-auto w-full rounded-2xl '}
            src={'/realm-buildings/mj_hut.png'}
            alt="Hut"
          />

          <div className="absolute top-0 w-full p-8 text-white bg-gradient-to-b from-gray-900 rounded-t-xl">
            <h2 className="flex justify-between p-1 px-2">
              Workhuts <br />{' '}
              <div className="">
                <span className="">{built}</span>
              </div>
            </h2>
          </div>
          <div className="absolute bottom-0 flex justify-between w-full p-8 text-xl text-white bg-gradient-to-t from-gray-900 rounded-2xl ">
            <span className="flex self-center ">
              <span className="self-center mr-2 ">Time till decay:</span>
              <CountdownTimer
                date={(
                  (decay - buildingIntegrity(RealmBuildingId.House)) *
                  1000
                ).toString()}
              />{' '}
            </span>
          </div>
        </div>

        <div className="w-full p-8 ">
          <div className="w-full p-2">
            <span className="self-center text-2xl">
              Workhuts increase your output by {WORK_HUT_OUTPUT} per day cycle.
              They cost {WORK_HUT_COST} of all the resources on your realm. They
              decay in{' '}
              {(
                buildingIntegrity(RealmBuildingId.House) /
                60 /
                60 /
                24
              ).toFixed(0)}{' '}
              days.
            </span>

            <div>
              <div className="flex mt-2 space-x-2">
                <Button
                  onClick={() => {
                    buildWorkHut();
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
                    );
                  }}
                  size="md"
                  variant="primary"
                >
                  Build
                </Button>
                <InputNumber
                  value={input.workHutsToBuild}
                  inputSize="md"
                  colorScheme="transparent"
                  className="bg-white border rounded border-white/40"
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
            <div className="flex flex-wrap mt-4">
              {props.realm.resources?.map((re, index) => (
                <div key={index} className="flex flex-col justify-center p-2">
                  <Image
                    src={'/resources/' + re.resourceId + '.jpg'}
                    alt="map"
                    width={100}
                    height={100}
                    className="border-4 rounded-full rounded-2xl border-yellow-800/40"
                  />

                  <span className="self-center mt-2 text-xl">
                    {WORK_HUT_COST} x {findResourceById(re.resourceId)?.trait}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
