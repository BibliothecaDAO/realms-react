import type { ReactElement } from 'react';
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
  power: <Power />,
  anger: <Anger />,
  brilliance: <Brilliance />,
  detection: <Detection />,
  enlightenment: <Enlightenment />,
  'the fox': <Fox />,
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
    xs: 'w-4 h-4 my-4',
    sm: 'w-6 h-6 my-4',
    md: 'w-8 h-8 my-4',
    lg: 'w-12 w-12 my-4',
  },
} as const;

export const OrderIcon = (props: Props) => {
  return (
    <div className={twMerge(STYLES.size[props.size], props.className)}>
      {Components[props.order]}
    </div>
  );
};
