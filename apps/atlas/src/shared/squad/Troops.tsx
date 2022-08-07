/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button, Table } from '@bibliotheca-dao/ui-lib/base';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { Popover } from '@headlessui/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { GetTroopStatsQuery } from '@/generated/graphql';
import type { ItemCost, TroopInterface } from '@/types/index';
import troopList from './TroopList';
interface HealthBarProps {
  vitality: number;
  troopId: number;
}

interface TroopProps {
  troop: TroopInterface;
  className?: string;
  withPurchase?: boolean;
  onClick?: (value: TroopInterface) => void;
  onSubmit: (value: TroopInterface) => void;
  onRemove: (value: TroopInterface) => void;
  troopsStats: GetTroopStatsQuery['getTroopStats'];
}

export const HealthBar = (props: HealthBarProps) => {
  const getVitality = () => {
    const vit =
      troopList.find((a) => a.troopId === props.troopId)?.vitality ?? 0;
    return (props.vitality / vit) * 100;
  };

  const getColour = () => {
    const vit = getVitality();
    if (vit > 70) {
      return 'bg-green-400 ';
    } else if (vit > 50) {
      return 'bg-yellow-200 ';
    } else if (vit > 25) {
      return 'bg-red-200 ';
    } else {
      return 'bg-red-500 ';
    }
  };

  return (
    <div
      style={{
        marginTop: `${100 - getVitality()}%`,
      }}
      className={`relative bottom-0 w-1 rounded-tl rounded-br rotate-180 transform mr-1 ${getColour()}`}
    ></div>
  );
};

export const TroopType = () => {
  return <div></div>;
};

const STYLES = {
  tier: {
    1: 'h-16',
    2: 'h-20',
    3: 'mx-auto h-24',
  },
} as const;

const columns = [
  { Header: 'name', id: 1, accessor: 'name' },
  // { Header: 'agility', id: 2, accessor: 'agility' },
  // { Header: 'Base Output', id: 2, accessor: 'baseOutput' },
  // { Header: 'attack', id: 3, accessor: 'attack' },
  // { Header: 'defense', id: 4, accessor: 'defense' },
  // { Header: 'vitality', id: 5, accessor: 'vitality' },
  // { Header: 'wisdom', id: 6, accessor: 'wisdom' },
  { Header: 'add', id: 6, accessor: 'add' },
  { Header: 'cost', id: 6, accessor: 'troopCost' },
];

const tableOptions = { is_striped: true };

type Row = {
  name: string;
  // agility: number;
  // attack: number;
  // defense: number;
  // vitality: number;
  // wisdom: number;
  troopCost: any[];
};

export const Troop = (props: TroopProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const getTroop = () => {
    return props.troopsStats?.find((a) => a.troopId === props.troop.troopId);
  };

  const getTroopTierList = () => {
    return props?.troopsStats?.filter((a) => a.tier === props.troop.tier);
  };

  const troopCostCell = (cost: ItemCost) => {
    // console.log(cost);
    return (
      <div className="w-24">
        <div className="flex justify-between">
          <Lords className="w-4" /> {cost.amount}
        </div>

        {cost.resources.map((a, index) => {
          return (
            <div key={index} className="flex justify-between">
              <span>{a.resourceName}</span> <span>{a.amount}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const mappedRowData: Row[] = (getTroopTierList() as any)?.map((re, index) => {
    return {
      name: <span className="tracking-wider uppercase">{re.troopName}</span>,
      // agility: re.agility,
      // attack: re.attack,
      // defense: re.defense,
      // vitality: re.vitality,
      // wisdom: re.wisdom,
      troopCost: troopCostCell(re.troopCost),
      add: (
        <Button
          variant="secondary"
          size="xs"
          onClick={() => {
            props.onSubmit(re);
          }}
        >
          add
        </Button>
      ),
    };
  });
  const style = {
    '--image-url': `url('/realm-troops/${getTroop()?.troopName}.png')`,
  } as React.CSSProperties;
  return (
    <div
      role={'button'}
      tabIndex={0}
      onClick={() => props.onClick && props.onClick(props.troop)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={style}
      className={`${twMerge(
        STYLES.tier[props.troop.tier],
        props.className
      )} bg-white/30 w-full bg-[image:var(--image-url)] object-cover bg-blend-overlay bg-contain bg-center bg-no-repeat rounded cursor-pointer bg-gradient-to-t shadow-inner flex`}
    >
      {getTroop()?.troopName && (
        <div>
          <HealthBar
            troopId={props.troop.troopId}
            vitality={props.troop.vitality}
          />

          <div className="mt-auto text-xs text-center text-indigo-700 uppercase sm:text-sm text-clip font-body">
            {getTroop()?.troopName}
          </div>
        </div>
      )}
      {/* {!props.withPurchase && (
        <Button
          variant="secondary"
          size="xs"
          onClick={() => {
            props.onRemove(props.troop);
          }}
        >
          x
        </Button>
      )} */}

      {/* {props.withPurchase && props.troop.vitality === 0 && ( */}
      <Popover className="relative top-0">
        <div ref={ref}>
          {isOpen && (
            <Popover.Panel
              className="absolute z-50 m-auto bottom-10 md:left-0"
              static
            >
              <div className="p-2 text-sm text-white bg-black rounded shadow-sm">
                <h5>{props.troop.troopName}</h5>
                Vitality: {props.troop.vitality}
                {/* <Table
                    columns={columns}
                    data={mappedRowData}
                    options={tableOptions}
                  /> */}
              </div>
            </Popover.Panel>
          )}
        </div>
      </Popover>
      {/* )} */}
    </div>
  );
};
