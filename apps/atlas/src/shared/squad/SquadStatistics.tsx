import clsx from 'clsx';
import { TroopSlot } from '@/constants/troops';
import { squadStats } from '@/shared/Getters/Realm';
import type { TroopInterface } from '@/types/index';

type Props = {
  troops: TroopInterface[];
  troopsQueued?: TroopInterface[];
  className?: string;
  reversed?: boolean;
  slot?: number;
};

const SquadStatistics = (props: Props) => {
  // attacking or defending
  const filteredArmy = props.troops.filter((a) => a.squadSlot === props.slot);

  const vitalityQueued = squadStats(props.troopsQueued).vitality;
  const attackQueued = squadStats(props.troopsQueued).attack;
  const armorQueued = squadStats(props.troopsQueued).armor;
  const wisdomQueued = squadStats(props.troopsQueued).wisdom;
  const agilityQueued = squadStats(props.troopsQueued).agility;

  const vitalitySum = squadStats(filteredArmy).vitality + vitalityQueued;
  const attackSum = squadStats(filteredArmy).attack + attackQueued;
  const armorSum = squadStats(filteredArmy).armor + armorQueued;
  const wisdomSum = squadStats(filteredArmy).wisdom + wisdomQueued;
  const agilitySum = squadStats(filteredArmy).agility + agilityQueued;

  return (
    <div
      className={clsx(
        props.className,
        'self-center w-full font-semibold tracking-widest uppercase px-2'
      )}
    >
      <div
        className={clsx(
          'flex justify-between',
          props.reversed && 'flex-row-reverse'
        )}
      >
        Vitality{' '}
        <span>
          {squadStats(filteredArmy).vitality}
          {vitalityQueued
            ? `+${squadStats(props.troopsQueued).vitality}=${vitalitySum}`
            : ''}
        </span>
      </div>
      <div
        className={clsx(
          'flex justify-between',
          props.reversed && 'flex-row-reverse'
        )}
      >
        Attack{' '}
        <span>
          {squadStats(filteredArmy).attack}
          {attackQueued
            ? `+${squadStats(props.troopsQueued).attack}=${attackSum}`
            : ''}
        </span>
      </div>
      <div
        className={clsx(
          'flex justify-between',
          props.reversed && 'flex-row-reverse'
        )}
      >
        Defense{' '}
        <span>
          {squadStats(filteredArmy).armor}
          {armorQueued
            ? `+${squadStats(props.troopsQueued).armor}=${armorSum}`
            : ''}
        </span>
      </div>
      <div
        className={clsx(
          'flex justify-between',
          props.reversed && 'flex-row-reverse'
        )}
      >
        Wisdom{' '}
        <span>
          {squadStats(filteredArmy).wisdom}
          {wisdomQueued
            ? `+${squadStats(props.troopsQueued).wisdom}=${wisdomSum}`
            : ''}
        </span>
      </div>
      <div
        className={clsx(
          'flex justify-between',
          props.reversed && 'flex-row-reverse'
        )}
      >
        Agility{' '}
        <span>
          {squadStats(filteredArmy).agility}
          {agilityQueued
            ? `+${squadStats(props.troopsQueued).agility}=${agilitySum}`
            : ''}
        </span>
      </div>
    </div>
  );
};

export default SquadStatistics;
