/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button, Table } from '@bibliotheca-dao/ui-lib/base';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { Popover } from '@headlessui/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { GetTroopStatsQuery } from '@/generated/graphql';
import useCombat from '@/hooks/settling/useCombat';
import type { ItemCost, TroopInterface } from '@/types/index';
interface HealthBarProps {
  vitality: number;
  troopId: number;
  baseVitality: number;
}

interface TroopProps {
  troop: TroopInterface;
  className?: string;
  withPurchase?: boolean;
  onClick?: (value: TroopInterface) => void;
  onSubmit?: (value: TroopInterface) => void;
  onRemove?: (value: TroopInterface) => void;
  troopsStats: GetTroopStatsQuery['getTroopStats'];
}

export const HealthBar = (props: HealthBarProps) => {
  const getVitality = () => {
    return (props.vitality / props.baseVitality) * 100;
  };

  const getColour = () => {
    const vit = getVitality();
    if (vit > 70) {
      return 'bg-green-800/70 ';
    } else if (vit > 50) {
      return 'bg-yellow-200 ';
    } else if (vit > 25) {
      return 'bg-red-200 ';
    } else {
      return 'bg-red-500 ';
    }
  };

  return (
    <div className="absolute bottom-0 flex h-full transform rotate-180">
      <div
        style={{
          height: `${getVitality()}%`,
        }}
        className={`${getColour()} transform w-2 rounded border border-white/30`}
      ></div>
    </div>
  );
};

const STYLES = {
  tier: {
    1: 'h-24 w-20',
    2: 'h-24 w-32',
    3: 'mx-auto w-24 h-32',
  },
} as const;

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

export const TroopCard = (props: TroopProps) => {
  const { troops } = useCombat();
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

  const getBaseTroopInfo = troops?.find(
    (a) => a.troopId === props.troop.troopId
  );

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
            props.onSubmit ? props.onSubmit(re) : console.log('s');
          }}
        >
          add
        </Button>
      ),
    };
  });

  return (
    <div>
      <div
        role={'button'}
        tabIndex={0}
        onClick={() => props.onClick && props.onClick(props.troop)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`${twMerge(
          STYLES.tier[props.troop.tier],
          props.className
        )} rounded-2xl cursor-pointer flex border-4 border-double border-white/30 shadow-black p-2 ${
          getBaseTroopInfo?.troopColour
        }`}
      >
        <div className="relative flex">
          {props.troop.troopName && (
            <Image
              src={`/realm-troops/${props.troop.troopName}.png`}
              alt=""
              width="200"
              height="200"
              className="z-10 object-contain object-center h-full"
            />
          )}
          {getTroop()?.troopName && (
            <HealthBar
              troopId={props.troop.troopId}
              vitality={props.troop.vitality}
              baseVitality={getTroop()?.vitality || 0}
            />
          )}
        </div>

        {/* {props.withPurchase && props.troop.vitality === 0 && ( */}
        <Popover className="relative top-0">
          <div ref={ref}>
            {isOpen && (
              <Popover.Panel
                className="absolute z-50 m-auto bottom-10 md:left-0"
                static
              >
                <div className="p-2 text-lg bg-black rounded shadow-sm">
                  <h4>Vitality {props.troop.vitality}</h4>

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
      <div className="mt-1 text-center align-bottom sm:text-sm text-clip font-display">
        {getTroop()?.troopName}
      </div>
    </div>
  );
};
