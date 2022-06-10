import { Button, ResourceIcon, Table } from '@bibliotheca-dao/ui-lib/base';
import { useState } from 'react';
import useCombat from '@/hooks/settling/useCombat';
import { Troop } from '@/shared/squad/Troops';
import type { ItemCost, TroopInterface } from '@/types/index';
import { findResourceName } from '@/util/resources';
interface Props {
  realmId: number;
  statistics: any;
}
const columns = [
  { Header: 'name', id: 1, accessor: 'name' },
  //   { Header: 'agility', id: 2, accessor: 'agility' },
  //   { Header: 'attack', id: 3, accessor: 'attack' },
  //   { Header: 'defense', id: 4, accessor: 'defense' },
  //   { Header: 'vitality', id: 5, accessor: 'vitality' },
  //   { Header: 'wisdom', id: 6, accessor: 'wisdom' },

  { Header: 'cost', id: 6, accessor: 'troopCost' },
  { Header: 'add', id: 6, accessor: 'add' },
];

const tableOptions = { is_striped: true };

type Row = {
  name: string;
  //   agility: number;
  //   attack: number;
  //   defense: number;
  //   vitality: number;
  //   wisdom: number;
  troopCost: any[];
};
export const ArmoryBuilder = (props: Props) => {
  const { buildSquad } = useCombat({ token_id: props.realmId });
  const [toBuy, setToBuy] = useState<TroopInterface[]>([]);

  const troopIdsToPurchase = () => {
    return toBuy.map((a: TroopInterface) => a.troopId);
  };

  const trimTroopFromSquad = (troop: TroopInterface) => {
    const index = toBuy.findIndex((a) => a.troopId === troop.troopId);

    setToBuy(() => [...toBuy.splice(index, 1)]);
  };
  const troopCostCell = (cost: ItemCost) => {
    console.log(cost);
    return (
      <div className="w-24">
        <div className="flex justify-between">
          {/* <Lords className="w-4" /> {cost.amount} */}
        </div>

        {cost.resources.map((a, index) => {
          return (
            <div key={index} className="flex justify-between">
              <span className="flex">
                <ResourceIcon
                  resource={
                    findResourceName(a.resourceId)?.trait.replace(' ', '') || ''
                  }
                  size="xs"
                  className="self-center mr-4"
                />
                <span>{a.amount}</span>
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  // const stats = () => {
  //   return {
  //     agility: props.troops
  //       .map((troop) => troop.agility)
  //       .reduce((prev, curr) => prev + curr, 0),
  //     attack: props.troops
  //       .map((troop) => troop.attack)
  //       .reduce((prev, curr) => prev + curr, 0),
  //     defense: props.troops
  //       .map((troop) => troop.defense)
  //       .reduce((prev, curr) => prev + curr, 0),
  //     vitality: props.troops
  //       .map((troop) => troop.vitality)
  //       .reduce((prev, curr) => prev + curr, 0),
  //     wisdom: props.troops
  //       .map((troop) => troop.wisdom)
  //       .reduce((prev, curr) => prev + curr, 0),
  //   };
  // };
  const mappedRowData: Row[] = (props.statistics as any)?.map((re, index) => {
    return {
      name: <span className="tracking-wider uppercase ">{re.troopName}</span>,
      //   agility: re.agility,
      //   attack: re.attack,
      //   defense: re.defense,
      //   vitality: re.vitality,
      //   wisdom: re.wisdom,
      troopCost: troopCostCell(re.troopCost),
      add: (
        <Button
          variant="secondary"
          size="xs"
          onClick={() => {
            setToBuy((current) => [...current, re]);
          }}
        >
          add to squad
        </Button>
      ),
    };
  });
  return (
    <div className="w-full">
      <h3>Squad Builder</h3>
      <div className="my-4 overflow-y-scroll h-72">
        {mappedRowData && (
          <Table
            columns={columns}
            data={mappedRowData}
            options={tableOptions}
          />
        )}
      </div>

      <div className="w-full p-8 rounded bg-white/20">
        <h4>buy troops</h4>{' '}
        <div className="flex flex-wrap">
          {toBuy.map((a, index) => {
            return (
              <Troop
                onSubmit={(value: TroopInterface) =>
                  setToBuy((current) => [...current, value])
                }
                onRemove={(value: TroopInterface) => trimTroopFromSquad(value)}
                withPurchase={false}
                key={index}
                troop={a}
                troopsStats={props.statistics}
              />
            );
          })}
        </div>
        <Button
          onClick={() => buildSquad(troopIdsToPurchase(), 1)}
          className="mt-4"
          variant="primary"
        >
          Purchase
        </Button>
        <Button
          onClick={() => setToBuy(() => [])}
          className="mt-4"
          variant="primary"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
