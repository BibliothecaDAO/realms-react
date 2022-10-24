import {
  Button,
  Card,
  CountdownTimer,
  OrderIcon,
  Tabs,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useMemo, useState } from 'react';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import { fetchRealmNameById, getTravelTime } from '@/shared/Getters/Realm';
import type { ArmyStatistics as Stats } from '@/types/index';

export interface ArmyAndOrder extends Army {
  orderType?: string;
}

type Prop = {
  army: ArmyAndOrder;
};

export const ArmyStatistics: React.FC<Prop> = (props) => {
  const { play } = useUiSounds(soundSelector.pageTurn);
  const army = props.army;
  const { getArmyStats } = useArmy();
  const armyStats = getArmyStats(props.army);

  return (
    <div>
      <div className="relative h-36">
        <ParentSize>
          {({ width, height }) => (
            <RadarMap armyOne={armyStats} height={height} width={width} />
          )}
        </ParentSize>
      </div>
      <div className="w-full mt-3 uppercase">
        <div className="flex justify-between">
          <h5 className="">Statistics</h5>
          <span className="pr-6 ml-auto">A</span> <span>D</span>
        </div>
        <hr className="border-white/30" />
        <div className="flex justify-between">
          Cavalry{' '}
          <span className="pr-3 ml-auto">{armyStats.cavalryAttack}</span>{' '}
          <span>{armyStats.cavalryDefence}</span>
        </div>
        <div className="flex justify-between">
          Archery{' '}
          <span className="pr-3 ml-auto">{armyStats.archeryAttack}</span>{' '}
          <span>{armyStats.archeryDefence}</span>
        </div>
        <div className="flex justify-between">
          Magic <span className="pr-3 ml-auto">{armyStats.magicAttack}</span>{' '}
          <span>{armyStats.magicDefence}</span>
        </div>
        <div className="flex justify-between">
          Infantry{' '}
          <span className="pr-3 ml-auto">{armyStats.infantryAttack}</span>{' '}
          <span>{armyStats.infantryDefence}</span>
        </div>
      </div>
    </div>
  );
};
