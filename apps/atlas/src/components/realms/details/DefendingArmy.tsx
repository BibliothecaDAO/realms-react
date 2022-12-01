import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Battalion } from '@/components/armies/squad/Battalion';
import { CostBlock } from '@/components/realms/RealmsGetters';
import {
  battalionInformation,
  defaultArmy,
  getUnitImage,
  battalionIdToString,
} from '@/constants/army';
import { MAX_BATTALIONS } from '@/constants/buildings';
import { useBankContext } from '@/context/BankContext';
import { useCommandList } from '@/context/CommandListContext';
import type { Army, GetRealmQuery } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { useArmy, nameArray } from '@/hooks/settling/useArmy';
import { Entrypoints } from '@/hooks/settling/useBuildings';
import useCombat from '@/hooks/settling/useCombat';
import { useCurrentQueuedBuildings } from '@/hooks/settling/useCurrentQueuedBuildings';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import type {
  ArmyBattalionQty,
  BattalionInterface,
  ResourceCost,
} from '@/types/index';
import { ArmyBuilder } from '../RealmArmyBuilder';

type Props = {
  realm: GetRealmQuery['realm'];
  buildings?: number[];
  availableFood: number | undefined;
};

export const DefendingArmy = (props: Props) => {
  const { realm, buildings, availableFood } = props;

  const blankArmy =
    props.realm.ownArmies.find((a) => a.armyId === 0) || defaultArmy;

  return (
    <div className="mt-3">
      <div className="justify-between col-span-12">
        <h2>Defending Army</h2>
        <p className="text-lg text-gray-700">
          This Army will defend your Realm from threats. Make sure to keep it
          fed.
        </p>
      </div>
      <ArmyBuilder
        realm={realm}
        armyId={0}
        army={blankArmy}
        buildings={buildings}
        availableFood={availableFood}
      />
    </div>
  );
};
