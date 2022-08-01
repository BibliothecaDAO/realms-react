import clsx from 'clsx';
import { squadStats } from '@/shared/Getters/Realm';
import type { TroopInterface } from '@/types/index';

type Props = {
  troops: TroopInterface[];
  troopsQueued?: TroopInterface[];
  className?: string;
  reversed?: boolean;
};

const SquadStatistics = (props: Props) => {
  const vitalityQueued = squadStats(props.troopsQueued).vitality;
  const attackQueued = squadStats(props.troopsQueued).attack;
  const defenseQueued = squadStats(props.troopsQueued).defense;
  const wisdomQueued = squadStats(props.troopsQueued).wisdom;
  const agilityQueued = squadStats(props.troopsQueued).agility;

  const vitalitySum = squadStats(props.troops).vitality + vitalityQueued;
  const attackSum = squadStats(props.troops).attack + attackQueued;
  const defenseSum = squadStats(props.troops).defense + defenseQueued;
  const wisdomSum = squadStats(props.troops).wisdom + wisdomQueued;
  const agilitySum = squadStats(props.troops).agility + agilityQueued;

  return (
    <div
      className={clsx(
        props.className,
        'self-center w-full font-semibold tracking-widest uppercase'
      )}
    >
      <div
        className={clsx(
          'flex justify-between',
          props.reversed && 'flex-row-reverse'
        )}
      >
        Vitality:{' '}
        <span>
          {squadStats(props.troops).vitality}
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
        Attack:{' '}
        <span>
          {squadStats(props.troops).attack}
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
        Defense:{' '}
        <span>
          {squadStats(props.troops).defense}
          {defenseQueued
            ? `+${squadStats(props.troopsQueued).defense}=${defenseSum}`
            : ''}
        </span>
      </div>
      <div
        className={clsx(
          'flex justify-between',
          props.reversed && 'flex-row-reverse'
        )}
      >
        Wisdom:{' '}
        <span>
          {squadStats(props.troops).wisdom}
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
        Agility:{' '}
        <span>
          {squadStats(props.troops).agility}
          {agilityQueued
            ? `+${squadStats(props.troopsQueued).agility}=${agilitySum}`
            : ''}
        </span>
      </div>
    </div>
  );
};

export default SquadStatistics;
