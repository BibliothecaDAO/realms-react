import {
  Button,
  CountdownTimer,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CostBlock } from '@/components/realms/RealmsGetters';
import {
  battalionInformation,
  getBattalionWeaknessByBuildingId,
  getBattlionStrengthByBuildingId,
  getUnitImage,
} from '@/constants/army';
import { buildingIntegrity } from '@/constants/globals';
import { useBankContext } from '@/context/BankContext';
import { useUIContext } from '@/context/UIContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { GetRealmQuery, Realm } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
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
  const { batchAddResources } = useBankContext();
  const { build } = useBuildings(props.realm as Realm);
  const { checkUserHasCheckoutResources, checkUserHasAvailableResources } =
    useGameConstants();
  const { balance } = useUserBalancesContext();
  const { toggleTrade } = useUIContext();

  const [buildQty, setBuildQty] = useState<BuildQuantity>({
    barracks: '1',
    archerTower: '1',
    castle: '1',
    mageTower: '1',
  });

  return (
    <div className="flex flex-wrap ">
      {props.buildings &&
        props.buildings
          ?.filter((a) => a.type === 'military')
          .map((a, i) => {
            return (
              <div
                key={i}
                className="w-full p-1 my-1 border-4 rounded border-yellow-800/40"
              >
                <div className="w-full px-2 border-b border-white/30">
                  <h3 className="flex py-1 ">
                    {a.name}
                    <span className="self-center ml-4 text-sm text-gray-700 ">
                      {(buildingIntegrity(a.id) / 60 / 60 / 24).toFixed(0)} Day
                      Decay Time
                    </span>
                    {a.quantityBuilt > 0 ? (
                      <span className="flex self-center ml-auto text-sm">
                        <span className="self-center mr-2 text-xs text-gray-700">
                          {a.quantityBuilt} Built | Decay in:
                        </span>
                        <CountdownTimer
                          date={(
                            (a.buildingDecay - buildingIntegrity(a.id)) *
                            1000
                          ).toString()}
                        />{' '}
                      </span>
                    ) : (
                      ''
                    )}
                  </h3>

                  <div>
                    Strong vs {getBattlionStrengthByBuildingId(a.id)} | Weak vs{' '}
                    {getBattalionWeaknessByBuildingId(a.id)}
                  </div>
                </div>

                <div className="flex self-center justify-between w-full">
                  <div className="relative self-center p-2">
                    <Image
                      height={200}
                      width={200}
                      className="rounded"
                      src={a.img}
                      alt=""
                    />
                  </div>
                  <div className="flex space-x-2">
                    {battalionInformation
                      .filter((b) => b.buildingId === a.id)
                      .map((c, i) => {
                        return (
                          <Image
                            key={i}
                            height={200}
                            width={125}
                            className="self-center object-fill rounded shadow-inner"
                            src={getUnitImage(c.id)}
                            alt=""
                          />
                        );
                      })}
                  </div>

                  <div className="w-1/3 p-3 ml-auto">
                    <div className="flex flex-wrap">
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
                    <div className="flex w-full mt-6 space-x-2">
                      <Button
                        onClick={() =>
                          build({
                            realmId: props.realm.realmId,
                            buildingId: a.id,
                            qty: buildQty[a.key],
                            costs: {
                              amount: 0,
                              resources: a.cost,
                            },
                          })
                        }
                        size="md"
                        variant="outline"
                        className="ml-auto"
                      >
                        construct
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};
