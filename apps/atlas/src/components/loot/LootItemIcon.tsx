import Chest from '@bibliotheca-dao/ui-lib/icons/loot/chest.svg';
import Foot from '@bibliotheca-dao/ui-lib/icons/loot/foot.svg';
import Hand from '@bibliotheca-dao/ui-lib/icons/loot/hand.svg';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Neck from '@bibliotheca-dao/ui-lib/icons/loot/neck.svg';
import Ring from '@bibliotheca-dao/ui-lib/icons/loot/ring.svg';
import Weapon from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';
import Waist from '@bibliotheca-dao/ui-lib/icons/loot/waist.svg';
import type { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';
type Props = {
  item: string;
  size: keyof (typeof STYLES)['size'];
  className?: string;
};

const Components: { [key: string]: ReactElement } = Object.freeze({
  '0': <Weapon />,
  '1': <Chest />,
  '2': <Head />,
  '3': <Waist />,
  '4': <Foot />,
  '5': <Hand />,
  '6': <Neck />,
  '7': <Ring />,
});

const STYLES = {
  size: {
    xs: 'w-4 my-4',
    sm: 'w-6 my-4',
    md: 'w-8 my-4',
    lg: 'w-12 my-4',
  },
} as const;

export const LootItemIcon = (props: Props) => {
  return (
    <span className={twMerge(STYLES.size[props.size], props.className)}>
      {Components[props.item]}
    </span>
  );
};
