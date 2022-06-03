import { Button } from '@bibliotheca-dao/ui-lib/base';
import { Popover } from '@headlessui/react';
import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { TroopInterface } from '@/types/index';
interface HealthBarProps {
  vitality: number;
  troopId: number;
}

interface TroopProps {
  troop: TroopInterface;
  className?: string;
  withPurchase?: boolean;
}

const troopList = [
  {
    name: 'watchman',
    type: 'melee',
    tier: 1,
    agility: 1,
    attack: 1,
    defense: 1,
    vitality: 4,
    wisdom: 1,
  },
  {
    name: 'squire',
    type: 'melee',
    tier: 1,
    agility: 1,
    attack: 1,
    defense: 1,
    vitality: 4,
    wisdom: 1,
  },
  {
    name: 'guard',
    type: 'melee',
    tier: 2,
    agility: 1,
    attack: 1,
    defense: 1,
    vitality: 4,
    wisdom: 1,
  },
  {
    name: 'archer',
    type: 'ranged',
    tier: 2,
    agility: 1,
    attack: 1,
    defense: 1,
    vitality: 4,
    wisdom: 1,
  },
  {
    name: 'guard captain',
    type: 'melee',
    tier: 3,
    agility: 1,
    attack: 1,
    defense: 1,
    vitality: 4,
    wisdom: 1,
  },
];

export const HealthBar = (props: HealthBarProps) => {
  const getVitality = () => {
    const vit = troopList.find((a) => a.id === props.troopId)?.vitality ?? 0;
    return (props.vitality / vit) * 100;
  };

  const getColour = () => {
    const vit = getVitality();
    if (vit > 70) {
      return 'bg-green-200 ';
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
        height: `${getVitality()}%`,
      }}
      className={`relative bottom-0 w-2 rounded-tl rounded-br ${getColour()}`}
    ></div>
  );
};

export const TroopType = () => {
  return <div></div>;
};

const STYLES = {
  tier: {
    1: 'w-10 h-16',
    2: 'w-24 h-16',
    3: 'w-48 h-20',
  },
} as const;

export const Troop = (props: TroopProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const getTroop = () => {
    return troopList.find((a) => a.tier === props.troop.tier);
  };

  const getTroopTierList = () => {
    return troopList.filter((a) => a.tier === props.troop.tier);
  };

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`${twMerge(
        STYLES.tier[props.troop.tier],
        props.className
      )} bg-white/50 rounded shadow-inner flex`}
    >
      <HealthBar
        troopId={props.troop.troopId}
        vitality={props.troop.vitality}
      />

      {/* <div className="mt-auto text-2xl text-center font-body">
        {getTroop()?.name}
      </div> */}
      {props.withPurchase && (
        <Popover className="relative top-0">
          <div ref={ref}>
            {isOpen && (
              <Popover.Panel
                className="absolute z-50 m-auto bottom-10 md:left-0"
                static
              >
                <div className="flex flex-col gap-6 px-8 py-4 pb-10 font-medium text-white bg-black rounded shadow-sm w-60">
                  <div className="text-center uppercase border-b text-md">
                    Select Troop to build
                  </div>
                  <ul>
                    {getTroopTierList().map((a, index) => {
                      return (
                        <li
                          className="flex justify-between my-2 font-lords"
                          key={index}
                        >
                          {a.name}{' '}
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => {
                              setIsOpen(!isOpen);
                            }}
                          >
                            add
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Popover.Panel>
            )}
          </div>
        </Popover>
      )}
    </div>
  );
};
