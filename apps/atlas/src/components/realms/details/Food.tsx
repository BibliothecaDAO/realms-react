import {
  Button,
  CountdownTimer,
  InputNumber,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';

import ChevronDown from '@bibliotheca-dao/ui-lib/icons/chevron-down.svg';
import ChevronUp from '@bibliotheca-dao/ui-lib/icons/chevron-up.svg';
import { formatEther } from '@ethersproject/units';
import type { ValueType } from '@rc-component/mini-decimal';

import React, { useMemo, useState } from 'react';
import {
  convertToK,
  getPopulation,
  getTrait,
} from '@/components/realms/RealmsGetters';
import {
  RealmBuildingId,
  FISH_ID,
  WHEAT_ID,
  buildingImageById,
} from '@/constants/globals';

import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { Realm, RealmFragmentFragment } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { useCurrentQueuedTxs } from '@/hooks/settling/useCurrentQueuedTxs';
import useFood, { Entrypoints } from '@/hooks/settling/useFood';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import useIsOwner from '@/hooks/useIsOwner';

type Prop = {
  realm: RealmFragmentFragment;
  totalRealmsCount?: number;
};
interface ResourceAndFoodInput {
  farmsToBuild: string;
  fishingVillagesToBuild: string;
  fishConversion: string;
  wheatConversion: string;
}

export const RealmsFood = (props: Prop) => {
  const { realm, totalRealmsCount } = props;

  const { balance } = useUserBalancesContext();
  const { getBuildingCostById } = useGameConstants();
  const { convert, availableFood } = useFood(realm as Realm);
  const isOwner = useIsOwner(realm?.settledOwner);

  const getFishBalance = useMemo(() => {
    return balance.find((a) => a.resourceId === FISH_ID)?.amount || '0';
  }, [balance]);

  const getWheatBalance = useMemo(() => {
    return balance.find((a) => a.resourceId === WHEAT_ID)?.amount || '0';
  }, [balance]);

  const { enqueuedHarvestTx: harvestFarmEnqueuedHarvestTx } =
    useCurrentQueuedTxs({
      moduleAddr: ModuleAddr.Food,
      entryPoint: Entrypoints.harvest,
      realmId: realm?.realmId,
    });

  const farmCapacity = getTrait(realm, 'River');
  const fishingVillageCapacity = getTrait(realm, 'Harbor');

  const [input, setInput] = useState<ResourceAndFoodInput>({
    farmsToBuild: farmCapacity,
    fishingVillagesToBuild: fishingVillageCapacity,
    fishConversion: '10000',
    wheatConversion: '10000',
  });

  const farmCosts = getBuildingCostById(RealmBuildingId.Farm);
  const fishingVillageCosts = getBuildingCostById(
    RealmBuildingId.FishingVillage
  );

  return (
    <div className="relative flex flex-wrap pb-2 border-4 rounded border-yellow-800/40">
      <div className="relative">
        <img
          alt="Storehouse"
          className={' mx-auto w-full rounded-xl '}
          src={buildingImageById(RealmBuildingId.StoreHouse)}
        />
        <div className="absolute top-0 w-full p-4 text-white bg-gradient-to-b from-gray-900 rounded-t-xl">
          <h3 className="flex justify-between ">Storehouse</h3>
          <p>You must keep your citizens fed!</p>
        </div>
        <div className="absolute bottom-0 flex items-center justify-between w-full p-4 bg-gradient-to-t from-gray-900">
          <div className="self-center p-1 mr-3 text-xl rounded bg-black/70">
            {availableFood ? availableFood : '0 Food in Store'}
          </div>

          {availableFood && availableFood > 0 ? (
            <div className="flex justify-end p-1 rounded bg-black/70">
              <CountdownTimer
                date={(
                  (availableFood / getPopulation(realm)) * 1000 +
                  new Date().getTime()
                ).toString()}
              />
            </div>
          ) : (
            <span className="self-center">Ser, your serfs are starving!!</span>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full p-3 text-xl font-semibold">
        <div className="flex ">
          <div className="mr-3">
            <ResourceIcon
              className="self-center"
              resource={'Wheat'}
              size="sm"
            />
          </div>

          <span className="self-center">Wheat</span>
        </div>
        <span className="self-center">
          {convertToK(+formatEther(getWheatBalance ?? 0))}
        </span>
      </div>

      <div className="flex justify-between w-full px-2 pb-2">
        <Button
          onClick={() => {
            convert(
              realm?.realmId,
              parseInt(input.wheatConversion).toFixed(0),
              WHEAT_ID
            );
          }}
          size="md"
          variant="outline"
        >
          Store
        </Button>
        <InputNumber
          value={input.wheatConversion}
          inputSize="md"
          colorScheme="transparent"
          className="w-2/3 mx-2 text-xl border rounded bg-black/10 border-white/10"
          min={1}
          inputClass="h-full mt-3"
          max={10000000}
          stringMode
          onChange={(value: ValueType | null) => {
            if (value) {
              setInput((current) => {
                return {
                  ...current,
                  wheatConversion: value.toString(),
                };
              });
            }
          }}
        />
        <div className="flex flex-grow">
          <div className="flex flex-col flex-grow">
            <Button
              onClick={() => {
                setInput((current) => {
                  return {
                    ...current,
                    wheatConversion: (
                      parseInt(current.wheatConversion) + 10000
                    ).toString(),
                  };
                });
              }}
              size="xs"
              variant="unstyled"
              className="flex justify-center px-2 border rounded border-white/10 hover:bg-white/10"
            >
              <ChevronUp />
            </Button>
            <Button
              size="xs"
              variant="unstyled"
              onClick={() => {
                setInput((current) => {
                  return {
                    ...current,
                    wheatConversion: (
                      parseInt(current.wheatConversion) - 10000
                    ).toString(),
                  };
                });
              }}
              className="flex justify-center px-2 border rounded border-white/10 hover:bg-white/10"
            >
              <ChevronDown />
            </Button>
          </div>
          <div className="flex flex-col flex-grow uppercase">
            <Button
              size="xs"
              variant="unstyled"
              className="px-2 border rounded border-white/10 hover:bg-white/10"
              onClick={() => {
                setInput((current) => {
                  return {
                    ...current,
                    wheatConversion: (+formatEther(
                      getWheatBalance ?? 0
                    )).toString(),
                  };
                });
              }}
            >
              all
            </Button>
            <Button
              size="xs"
              variant="unstyled"
              className="px-2 border rounded border-white/10 hover:bg-white/10"
              onClick={() => {
                setInput((current) => {
                  return {
                    ...current,
                    wheatConversion: (
                      +formatEther(getWheatBalance ?? 0) / 2
                    ).toString(),
                  };
                });
              }}
            >
              half
            </Button>
          </div>
          {totalRealmsCount && (
            <div className="flex flex-col flex-grow uppercase">
              <Button
                size="xs"
                variant="unstyled"
                className="px-2 border rounded border-white/10 hover:bg-white/10"
                onClick={() => {
                  setInput((current) => {
                    return {
                      ...current,
                      wheatConversion: Math.floor(
                        +formatEther(getWheatBalance ?? 0) / totalRealmsCount
                      ).toString(),
                    };
                  });
                }}
              >
                1/{totalRealmsCount}
              </Button>
              <Button
                size="xs"
                variant="unstyled"
                className="px-2 border rounded border-white/10 hover:bg-white/10"
                onClick={() => {
                  setInput((current) => {
                    return {
                      ...current,
                      wheatConversion: Math.floor(
                        +formatEther(getWheatBalance ?? 0) /
                          totalRealmsCount /
                          2
                      ).toString(),
                    };
                  });
                }}
              >
                1/{totalRealmsCount * 2}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full p-3 text-xl font-semibold">
        <div className="flex">
          <div className="mr-2 ">
            <ResourceIcon className="self-center" resource={'Fish'} size="sm" />
          </div>

          <span className="self-center">Fish</span>
        </div>

        <span className="self-center">
          {convertToK(+formatEther(getFishBalance ?? 0))}
        </span>
      </div>

      <div className="flex justify-between w-full px-2">
        <Button
          onClick={() => {
            convert(
              realm?.realmId,
              parseInt(input.fishConversion).toFixed(0),
              FISH_ID
            );
          }}
          size="md"
          variant="outline"
        >
          Store
        </Button>
        <InputNumber
          value={input.fishConversion}
          inputSize="md"
          colorScheme="transparent"
          className="w-2/3 mx-2 text-xl border rounded bg-black/10 border-white/10"
          min={1}
          inputClass="h-full mt-3"
          max={10000000}
          stringMode
          onChange={(value: ValueType | null) => {
            if (value) {
              setInput((current) => {
                return {
                  ...current,
                  fishConversion: value.toString(),
                };
              });
            }
          }}
        />
        <div className="flex flex-grow">
          <div className="flex flex-col flex-grow">
            <Button
              size="xs"
              variant="unstyled"
              className="flex justify-center px-2 border rounded border-white/10 hover:bg-white/10"
              onClick={() => {
                setInput((current) => {
                  return {
                    ...current,
                    fishConversion: (
                      parseInt(current.fishConversion) + 10000
                    ).toString(),
                  };
                });
              }}
            >
              <ChevronUp />
            </Button>
            <Button
              size="xs"
              variant="unstyled"
              className="flex justify-center px-2 border rounded border-white/10 hover:bg-white/10"
              onClick={() => {
                setInput((current) => {
                  return {
                    ...current,
                    fishConversion: (
                      parseInt(current.fishConversion) - 10000
                    ).toString(),
                  };
                });
              }}
            >
              <ChevronDown />
            </Button>
          </div>
          <div className="flex flex-col flex-grow uppercase">
            <Button
              size="xs"
              variant="unstyled"
              className="px-2 border rounded border-white/10 hover:bg-white/10"
              onClick={() => {
                setInput((current) => {
                  return {
                    ...current,
                    fishConversion: (+formatEther(
                      getFishBalance ?? 0
                    )).toString(),
                  };
                });
              }}
            >
              all
            </Button>
            <Button
              size="xs"
              variant="unstyled"
              className="px-2 border rounded border-white/10 hover:bg-white/10"
              onClick={() => {
                setInput((current) => {
                  return {
                    ...current,
                    fishConversion: (
                      +formatEther(getFishBalance ?? 0) / 2
                    ).toString(),
                  };
                });
              }}
            >
              half
            </Button>
          </div>
          {totalRealmsCount && (
            <div className="flex flex-col flex-grow uppercase">
              <Button
                size="xs"
                variant="unstyled"
                className="px-2 border rounded border-white/10 hover:bg-white/10"
                onClick={() => {
                  setInput((current) => {
                    return {
                      ...current,
                      fishConversion: Math.floor(
                        +formatEther(getFishBalance ?? 0) / totalRealmsCount
                      ).toString(),
                    };
                  });
                }}
              >
                1/{totalRealmsCount}
              </Button>
              <Button
                size="xs"
                variant="unstyled"
                className="px-2 border rounded border-white/10 hover:bg-white/10"
                onClick={() => {
                  setInput((current) => {
                    return {
                      ...current,
                      fishConversion: Math.floor(
                        +formatEther(getFishBalance ?? 0) / totalRealmsCount / 2
                      ).toString(),
                    };
                  });
                }}
              >
                1/{totalRealmsCount * 2}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
