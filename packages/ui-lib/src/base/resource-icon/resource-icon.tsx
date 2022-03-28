import type { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';
import Adamantine from '../../icons/resources/Adamantine.svg';
import AlchemicalSilver from '../../icons/resources/AlchemicalSilver.svg';
import Coal from '../../icons/resources/Coal.svg';
import ColdIron from '../../icons/resources/ColdIron.svg';
import Copper from '../../icons/resources/Copper.svg';
import DeepCrystal from '../../icons/resources/DeepCrystal.svg';
import Diamonds from '../../icons/resources/Diamonds.svg';
import Dragonhide from '../../icons/resources/Dragonhide.svg';
import EtherealSilica from '../../icons/resources/EtherealSilica.svg';
import Gold from '../../icons/resources/Gold.svg';
import Hartwood from '../../icons/resources/Hartwood.svg';
import Ignium from '../../icons/resources/Ignium.svg';
import Ironwood from '../../icons/resources/Ironwood.svg';
import Mithral from '../../icons/resources/Mithral.svg';
import Obsidian from '../../icons/resources/Obsidian.svg';
import Ruby from '../../icons/resources/Ruby.svg';
import Sapphire from '../../icons/resources/Sapphire.svg';
import Silver from '../../icons/resources/Silver.svg';
import Stone from '../../icons/resources/Stone.svg';
import TrueIce from '../../icons/resources/TrueIce.svg';
import TwilightQuartz from '../../icons/resources/TwilightQuartz.svg';
import Wood from '../../icons/resources/Wood.svg';
export type Props = {
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
  Dragonhide: <Dragonhide />,
  EtherealSilica: <EtherealSilica />,
  Gold: <Gold />,
  Hartwood: <Hartwood />,
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
