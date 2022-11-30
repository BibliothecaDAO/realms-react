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
import { BattalionWithImage } from '@/components/armies/squad/BattalionWithImage';
import {
  fetchRealmNameById,
  getTravelTime,
} from '@/components/realms/RealmsGetters';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army } from '@/generated/graphql';
import { nameArray, useArmy } from '@/hooks/settling/useArmy';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import type { ArmyStatistics as Stats } from '@/types/index';

export interface ArmyAndOrder extends Army {
  orderType?: string;
}

type Prop = {
  army: ArmyAndOrder;
};

export const ArmyStatistics: React.FC<Prop> = (props) => {
  const army = props.army;
  const { battalions, getArmyStats } = useArmy();
  const armyStats = getArmyStats(props.army);

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 p-2 ">
        {battalions?.map((battalion, index) => {
          return (
            <>
              {army && army[nameArray[index] + 'Qty'] > 0 && (
                <BattalionWithImage
                  key={index}
                  {...battalion}
                  quantity={army ? army[nameArray[index] + 'Qty'] : ''}
                  health={army ? army[nameArray[index] + 'Health'] : ''}
                />
              )}
            </>
          );
        })}
      </div>
      <div className="w-full mt-3">
        <div className="flex justify-between">
          <h4 className="">Statistics</h4>
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
