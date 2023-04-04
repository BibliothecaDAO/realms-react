import clsx from 'clsx';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  Anger,
  Brilliance,
  Detection,
  Enlightenment,
  Fox,
  Fury,
  Giants,
  Perfection,
  Power,
  Protection,
  Rage,
  Reflection,
  Skill,
  Titans,
  Twins,
  Vitriol,
} from '../../icons/orders';

export type Props = {
  order: string;
  size: keyof typeof STYLES['size'];
  className?: string;
  containerClassName?: string;
  withTooltip?: boolean;
};

const Components: { [key: string]: ReactElement } = Object.freeze({
  power: <Power/>,
  anger: <Anger />,
  brilliance: <Brilliance />,
  detection: <Detection />,
  enlightenment: <Enlightenment />,
  fox: <Fox/>,
  fury: <Fury />,
  giants: <Giants />,
  perfection: <Perfection/>,
  reflection: <Reflection />,
  skill: <Skill />,
  titans: <Titans />,
  twins: <Twins />,
  vitriol: <Vitriol />,
  rage: <Rage />,
  protection: <Protection />,
});

const STYLES = {
  size: {
    xs: 'w-4 h-4 flex justify-center paper',
    sm: 'w-6 h-6 flex justify-center paper',
    md: 'w-8 h-8 flex justify-center paper',
    lg: 'w-12 h-12 flex justify-center paper',
  },
} as const;

export const OrderIcon = (props: Props) => {
  const order = props.order.toLowerCase();

  return (
    <div className={twMerge('relative group', props.containerClassName)}>
      <div className={twMerge(STYLES.size[props.size], props.className)}>
        {Components[order.replace('_', ' ')]}
      </div>
      {props.withTooltip && (
        <div className="absolute top-0 flex flex-col items-center hidden -translate-y-full w-max group-hover:flex">
          <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap rounded shadow-lg bg-gray-1000">
            Order of {order.includes('the') && 'the '}
            <span className="capitalize">{order.replace('the ', '')}</span>
          </span>
          <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-1000"></div>
        </div>
      )}
    </div>
  );
};
