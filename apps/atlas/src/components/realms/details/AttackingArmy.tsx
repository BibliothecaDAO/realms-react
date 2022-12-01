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
import { ArmyCard } from '@/components/armies/ArmyCard';
import { Battalion } from '@/components/armies/squad/Battalion';
import {
  CostBlock,
  fetchRealmNameById,
} from '@/components/realms/RealmsGetters';
import {
  battalionInformation,
  defaultArmy,
  getUnitImage,
  battalionIdToString,
} from '@/constants/army';
import { MAX_BATTALIONS } from '@/constants/buildings';
import { useAtlasContext } from '@/context/AtlasContext';
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

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

export const AttackingArmy = (props: Props) => {
  const { realm, buildings, availableFood } = props;

  const {
    travelContext: { travel, setTravelArcs },
  } = useAtlasContext();

  const [selectedArmy, setSelectedArmy] = useState<Army | undefined>();

  const [newArmyId, setNewArmyId] = useState<number>();

  const onlyAttackingArmies = realm.ownArmies.filter((a) => a.armyId !== 0);

  return (
    <div>
      <div className="grid grid-cols-12 gap-6 pt-4">
        <div className="col-span-12">
          <h3>{fetchRealmNameById(realm.realmId || 0)} Armies </h3>
        </div>
        {onlyAttackingArmies.length > 0 && !newArmyId && (
          <div className="col-span-12">
            <div className="grid grid-cols-2 gap-4">
              {onlyAttackingArmies.map((army) => {
                return (
                  <ArmyCard
                    onBuildArmy={() => {
                      // setSelectedArmy(army);
                      // setIsArmyBuilding(true);
                    }}
                    onTravel={() =>
                      travel(army.armyId, army.realmId, realm.realmId)
                    }
                    selectedRealm={realm.realmId}
                    key={army.armyId}
                    army={army}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      {!newArmyId && (
        <div>
          <div className="mt-20">
            <Button
              onClick={() => setNewArmyId(onlyAttackingArmies.length + 1)}
              variant="outline"
            >
              Summon new Army ID {onlyAttackingArmies.length + 1}
            </Button>
          </div>
        </div>
      )}

      {selectedArmy && (
        <div>
          <Button>back</Button>
          <ArmyBuilder
            realm={realm}
            armyId={selectedArmy.armyId}
            army={selectedArmy || null}
            buildings={buildings}
            availableFood={availableFood}
          />
        </div>
      )}
      {newArmyId && (
        <div className="mt-10">
          <div className="flex justify-between">
            <h2>Army {newArmyId}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewArmyId(undefined)}
            >
              Back to Armies
            </Button>
          </div>

          <ArmyBuilder
            realm={realm}
            armyId={newArmyId}
            buildings={buildings}
            availableFood={availableFood}
          />
        </div>
      )}
    </div>
  );
};
