import { Button, InputNumber } from '@bibliotheca-dao/ui-lib/base';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import type { ValueType } from '@rc-component/mini-decimal';
import { useEffect, useState } from 'react';
import { ResourcesIds } from '@/constants/resources';
import type { RealmFragmentFragment } from '@/generated/graphql';
import useLabor from '@/hooks/settling/useLabor';
import { CostBlock, getTrait } from '../RealmsGetters';

export const BuyLabor = ({
  costs,
  isFood,
  realm,
  resource,
  realms,
}: {
  costs: any;
  isFood: boolean;
  realm?: any;
  resource: any;
  realms?: RealmFragmentFragment[];
}) => {
  const { create, harvest, create_food, harvest_food } = useLabor();

  const getFarms = getTrait(realm, 'River');
  const getFishingVillages = getTrait(realm, 'Harbor');

  const foodProductionCap =
    resource.resourceId === ResourcesIds.Wheat ? getFarms : getFishingVillages;

  const [input, setInput] = useState(isFood ? foodProductionCap : '12');

  const buyTools = () => {
    if (!realms) {
      create({
        realmId: realm.realmId,
        resourceId: resource.resourceId,
        laborUnits: input,
        costs: costs,
      });
    } else {
      realms.forEach((_realm) => {
        create({
          realmId: _realm.realmId,
          resourceId: resource.resourceId,
          laborUnits: input,
          costs: costs,
        });
      });
    }
  };

  const buyFood = () => {
    if (!realms) {
      create_food({
        realmId: realm.realmId,
        resourceId: resource.resourceId,
        laborUnits: 12,
        qtyBuilt: input,
        costs: costs,
      });
    } else {
      realms.forEach((_realm) => {
        const getFarmsTmp = getTrait(_realm, 'River');
        const getFishingVillagesTmp = getTrait(_realm, 'Harbor');

        const foodProductionCapTmp =
          resource.resourceId === ResourcesIds.Wheat
            ? getFarmsTmp
            : getFishingVillagesTmp;
        create_food({
          realmId: _realm.realmId,
          resourceId: resource.resourceId,
          laborUnits: 12,
          qtyBuilt: foodProductionCapTmp,
          costs: temporyCosts,
        });
      });
    }
  };

  // tempory
  const temporyCosts = [
    {
      resourceId: 1,
      resourceName: 'Wood',
      amount: 19.09,
    },
  ];

  return (
    // <Tooltip
    //   placement="top"
    //   className="flex"
    //   tooltipText={
    //     <div className="flex p-1 text-sm rounded bg-gray-1000 whitespace-nowrap">
    //       {costs?.map((cost, index) => {
    //         return (
    //           <CostBlock
    //             key={index}
    //             resourceName={cost.resourceName}
    //             amount={cost.amount / 12}
    //             id={cost.resourceId}
    //             qty={12}
    //           />
    //         );
    //       })}
    //     </div>
    //   }
    // >
    <div className="flex">
      {!isFood ? (
        <Button onClick={buyTools} variant="outline" size="xs">
          Buy Tools {realms ? `(${realms.length} Realms)` : ''}
        </Button>
      ) : (
        <Button onClick={buyFood} variant="outline" size="xs">
          Build {realms ? `(${realms.length} Realms)` : ''}
        </Button>
      )}
      {realm ||
        (realms && !isFood && (
          <InputNumber
            value={input}
            inputSize="md"
            colorScheme="transparent"
            className="w-12 text-xl border rounded bg-black/10 border-white/10"
            min={1}
            inputClass=""
            max={10000000}
            stringMode
            onChange={(value) => {
              if (value) {
                setInput(value.toString());
              }
            }}
          />
        ))}
    </div>
    // </Tooltip>
  );
};
