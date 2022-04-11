import Anger from '@bibliotheca-dao/ui-lib/icons/orders/anger.svg';
import Brilliance from '@bibliotheca-dao/ui-lib/icons/orders/brilliance.svg';
import Detection from '@bibliotheca-dao/ui-lib/icons/orders/detection.svg';
import Enlightenment from '@bibliotheca-dao/ui-lib/icons/orders/enlightenment.svg';
import Fox from '@bibliotheca-dao/ui-lib/icons/orders/fox.svg';
import Fury from '@bibliotheca-dao/ui-lib/icons/orders/fury.svg';
import Giants from '@bibliotheca-dao/ui-lib/icons/orders/giants.svg';
import Perfection from '@bibliotheca-dao/ui-lib/icons/orders/perfection.svg';
import Power from '@bibliotheca-dao/ui-lib/icons/orders/power.svg';
import Protection from '@bibliotheca-dao/ui-lib/icons/orders/protection.svg';
import Rage from '@bibliotheca-dao/ui-lib/icons/orders/rage.svg';
import Reflection from '@bibliotheca-dao/ui-lib/icons/orders/reflection.svg';
import Skill from '@bibliotheca-dao/ui-lib/icons/orders/skill.svg';
import Titans from '@bibliotheca-dao/ui-lib/icons/orders/titans.svg';
import Twins from '@bibliotheca-dao/ui-lib/icons/orders/twins.svg';
import Vitriol from '@bibliotheca-dao/ui-lib/icons/orders/vitriol.svg';
import type { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';
type Props = {
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
    xs: 'w-4 my-4',
    sm: 'w-6 my-4',
    md: 'w-8 my-4',
    lg: 'w-12 my-4',
  },
} as const;

export const OrderIcon = (props: Props) => {
  return (
    <div className={twMerge(STYLES.size[props.size], props.className)}>
      {Components[props.order]}
    </div>
  );
};
