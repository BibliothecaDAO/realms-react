import Adamantine from '@bibliotheca-dao/ui-lib/icons/resources/Adamantine.svg';
import AlchemicalSilver from '@bibliotheca-dao/ui-lib/icons/resources/AlchemicalSilver.svg';
import Coal from '@bibliotheca-dao/ui-lib/icons/resources/Coal.svg';
import ColdIron from '@bibliotheca-dao/ui-lib/icons/resources/ColdIron.svg';
import Copper from '@bibliotheca-dao/ui-lib/icons/resources/Copper.svg';
import DeepCrystal from '@bibliotheca-dao/ui-lib/icons/resources/DeepCrystal.svg';
import Diamonds from '@bibliotheca-dao/ui-lib/icons/resources/Diamonds.svg';
import DragonHide from '@bibliotheca-dao/ui-lib/icons/resources/DragonHide.svg';
import EtheralSilica from '@bibliotheca-dao/ui-lib/icons/resources/EtheralSilica.svg';
import Gold from '@bibliotheca-dao/ui-lib/icons/resources/Gold.svg';
import HeartWood from '@bibliotheca-dao/ui-lib/icons/resources/HeartWood.svg';
import Ignium from '@bibliotheca-dao/ui-lib/icons/resources/Ignium.svg';
import Ironwood from '@bibliotheca-dao/ui-lib/icons/resources/Ironwood.svg';
import Mithral from '@bibliotheca-dao/ui-lib/icons/resources/Mithral.svg';
import Obsidian from '@bibliotheca-dao/ui-lib/icons/resources/Obsidian.svg';
import Ruby from '@bibliotheca-dao/ui-lib/icons/resources/Ruby.svg';
import Sapphire from '@bibliotheca-dao/ui-lib/icons/resources/Sapphire.svg';
import Silver from '@bibliotheca-dao/ui-lib/icons/resources/Silver.svg';
import Stone from '@bibliotheca-dao/ui-lib/icons/resources/Stone.svg';
import TrueIce from '@bibliotheca-dao/ui-lib/icons/resources/TrueIce.svg';
import TwilightQuartz from '@bibliotheca-dao/ui-lib/icons/resources/TwilightQuartz.svg';
import Wood from '@bibliotheca-dao/ui-lib/icons/resources/Wood.svg';
import type { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';
type Props = {
  resource: string;
  size: keyof typeof STYLES['size'];
  className?: string;
};

const Components: { [key: string]: ReactElement } = Object.freeze({
  Adamantine: <Adamantine />,
  AlchemicalSilver: <AlchemicalSilver />,
  Coal: <Coal />,
  ColdIron: <ColdIron />,
  Copper: <Copper />,
  DeepCrystal: <DeepCrystal />,
  Diamonds: <Diamonds />,
  DragonHide: <DragonHide />,
  EtheralSilica: <EtheralSilica />,
  Gold: <Gold />,
  HeartWood: <HeartWood />,
  Ignium: <Ignium />,
  Ironwood: <Ironwood />,
  Mithral: <Mithral />,
  Obsidian: <Obsidian />,
  Ruby: <Ruby />,
  Sapphire: <Sapphire />,
  Silver: <Silver />,
  Stone: <Stone />,
  TrueIce: <TrueIce />,
  TwilightQuartz: <TwilightQuartz />,
  Wood: <Wood />,
});

const STYLES = {
  size: {
    xs: 'w-4',
    sm: 'w-6',
    md: 'w-8',
    lg: 'w-12',
  },
} as const;

export const ResourceIcon = (props: Props) => {
  return (
    <div className={twMerge(STYLES.size[props.size], props.className)}>
      {Components[props.resource]}
    </div>
  );
};
