import {
  Button,
  CountdownTimer,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import { useState } from 'react';
import { buildingIntegrity } from '@/constants/buildings';
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
            <div key={i} className="flex flex-wrap w-full ">
              <div className="self-center">
                <Image
                  height={120}
                  width={120}
                  className="object-fill bg-white border rounded paper"
                  src={a.img}
                  alt=""
                />
              </div>

              <div className="p-2 ml-4 capitalize">
                <div className="w-full text-xs">
                  {(buildingIntegrity(a.id) / 60 / 60 / 24).toFixed(0)} Day
                  Decay
                </div>
                <h3>
                  {a.name} - {a.quantityBuilt}
                </h3>
                <div className="flex flex-wrap my-1">
                  <div className="flex">
                    <div className="self-end">
                      <CountdownTimer
                        date={(a.buildingDecay * 1000).toString()}
                      />{' '}
                    </div>
                  </div>
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
                  >
                    build
                  </Button>
                  <InputNumber
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
                  />{' '}
                </div>
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
              </div>
            </div>
          );
        })}
    </div>
  );
};
