import type { ReactElement } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Anger from '../../icons/orders/anger.svg';
import Brilliance from '../../icons/orders/brilliance.svg';
import Detection from '../../icons/orders/detection.svg';
import Enlightenment from '../../icons/orders/enlightenment.svg';
import Fox from '../../icons/orders/fox.svg';
import Fury from '../../icons/orders/fury.svg';
import Giants from '../../icons/orders/giants.svg';
import Perfection from '../../icons/orders/perfection.svg';
import Power from '../../icons/orders/power.svg';
import Protection from '../../icons/orders/protection.svg';
import Rage from '../../icons/orders/rage.svg';
import Reflection from '../../icons/orders/reflection.svg';
import Skill from '../../icons/orders/skill.svg';
import Titans from '../../icons/orders/titans.svg';
import Twins from '../../icons/orders/twins.svg';
import Vitriol from '../../icons/orders/vitriol.svg';

export type Props = {
  order: string;
  size: keyof typeof STYLES['size'];
  className?: string;
};

const Components: { [key: string]: ReactElement } = Object.freeze({
  power: <Power className="stroke-8 stroke-order-power" />,
  anger: <Anger />,
  brilliance: <Brilliance />,
  detection: <Detection />,
  enlightenment: <Enlightenment />,
  'the fox': <Fox className="stroke-8 stroke-order-fox" />,
  fury: <Fury />,
  giants: <Giants />,
  perfection: <Perfection />,
  reflection: <Reflection />,
  skill: <Skill />,
  titans: <Titans />,
  'the twins': <Twins />,
  vitriol: <Vitriol />,
  rage: <Rage />,
  protection: <Protection />,
});

const STYLES = {
  size: {
    xs: 'w-4 h-4 my-4 flex',
    sm: 'w-6 h-6 my-4 flex',
    md: 'w-8 h-8 my-4 flex',
    lg: 'w-12 h-12 my-4 flex',
  },
} as const;

export const OrderIcon = (props: Props) => {
  const [open, setIsOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={
        twMerge(STYLES.size[props.size], props.className) +
        ` stroke-order-${props.order
          .replace('the', '')
          .replace('_', '')
          .replace(' ', '')}`
      }
    >
      {Components[props.order.replace('_', ' ')]}
      <div
        className={`mt-2 absolute p-2 bg-black/40 rounded-sm uppercase ${
          open ? 'block' : 'hidden'
        }`}
      >
        {props.order.replace('_', ' ')}
      </div>
    </div>
  );
};
