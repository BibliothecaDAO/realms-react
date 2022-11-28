import {
  Button,
  CountdownTimer,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { battalionInformation, getUnitImage } from '@/constants/army';
import { buildingIntegrity } from '@/constants/buildings';
import { useResourcesContext } from '@/context/ResourcesContext';
import type { GetRealmQuery, Realm } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import { CostBlock } from '@/shared/Getters/Realm';
import type { BuildingDetail } from '@/types/index';

interface BuildQuantity {
  barracks: string;
  archerTower: string;
  castle: string;
  mageTower: string;
}

type Prop = {
  realm: GetRealmQuery['realm'];
  buildings: BuildingDetail[] | undefined;
};

export const MilitaryBuildings = (props: Prop) => {
  const { batchAddResources } = useResourcesContext();
  const { build } = useBuildings(props.realm as Realm);
  const [buildQty, setBuildQty] = useState<BuildQuantity>({
    barracks: '1',
    archerTower: '1',
    castle: '1',
    mageTower: '1',
  });

  return (
    <div className="flex flex-wrap">
      {props.buildings
        ?.filter((a) => a.type === 'military')
        .map((a, i) => {
          return (
            <div key={i} className="flex w-full my-2">
              <div className="relative self-center border border-yellow-900 rounded">
                <Image
                  height={200}
                  width={200}
                  className="object-fill bg-white rounded"
                  src={a.img}
                  alt=""
                />
                <span className="absolute px-2 text-gray-700 bg-white rounded-full bottom-2 left-2">
                  {a.quantityBuilt}
                </span>
              </div>
              <div className="flex flex-wrap w-full px-4 capitalize">
                <div className="w-full ">
                  <div className="bg-gradient-to-r from-gray-1000 via-red-900 to-gray-1000 py-[2px] ">
                    <h3 className="flex p-1 px-2 shadow-xl shadow-red-700/20 bg-gray-1000">
                      {a.name}{' '}
                      <span className="self-center ml-4 text-xs text-gray-700 ">
                        {(buildingIntegrity(a.id) / 60 / 60 / 24).toFixed(0)}{' '}
                        Day Decay Time
                      </span>
                      <span className="flex self-center ml-auto text-sm">
                        <span className="self-center mr-2 text-xs text-gray-700">
                          Time till decay:
                        </span>
                        <CountdownTimer
                          date={(
                            (a.buildingDecay - buildingIntegrity(a.id)) *
                            1000
                          ).toString()}
                        />{' '}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex self-center justify-between w-full">
                  <div className="flex space-x-2">
                    {battalionInformation
                      .filter((b) => b.buildingId === a.id)
                      .map((c, i) => {
                        return (
                          <Image
                            key={i}
                            height={90}
                            width={90}
                            className="self-center object-fill bg-white border border-yellow-900 rounded shadow-inner"
                            src={getUnitImage(c.id)}
                            alt=""
                          />
                        );
                      })}
                  </div>

                  <div>
                    <div className="flex mt-2">
                      {a.cost &&
                        a.cost.map((b, i) => {
                          return (
                            <CostBlock
                              key={i}
                              resourceName={b.resourceName}
                              amount={b.amount}
                              id={b.resourceId}
                              qty={buildQty[a.key]}
                            />
                          );
                        })}
                    </div>
                    <div className="flex w-full mt-1 space-x-2">
                      <Button
                        onClick={() =>
                          build({
                            realmId: props.realm.realmId,
                            buildingId: a.id,
                            qty: buildQty[a.key],
                            costs: {
                              // Mimic ItemCost interface
                              amount: 0,
                              resources: a.cost,
                            },
                          })
                        }
                        size="xs"
                        variant="primary"
                        className="ml-auto"
                      >
                        construct
                      </Button>
                      {/* <InputNumber
                        value={buildQty[a.key]}
                        inputSize="sm"
                        colorScheme="transparent"
                        className="w-12 bg-white border rounded border-white/40"
                        min={1}
                        max={10}
                        stringMode
                        onChange={(value) => {
                          if (value) {
                            setBuildQty((current) => {
                              return {
                                ...current,
                                [a.key]: value.toString(),
                              };
                            });
                          }
                        }}
                      />{' '} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
