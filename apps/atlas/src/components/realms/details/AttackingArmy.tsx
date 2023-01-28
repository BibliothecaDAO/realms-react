import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ArmyCard } from '@/components/armies/armyCard/ArmyCard';
import { Battalion } from '@/components/armies/squad/Battalion';
import {
  CostBlock,
  getRealmNameById,
  resourcePillaged,
} from '@/components/realms/RealmsGetters';
import {
  battalionInformation,
  defaultArmy,
  getUnitImage,
  battalionIdToString,
} from '@/constants/army';
import { MAX_BATTALIONS } from '@/constants/globals';
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
import {
  ArmyBattalionQty,
  BattalionInterface,
  realmMilitaryEvents,
  ResourceCost,
} from '@/types/index';
import { HistoryCard } from '../HistoryCard';
import { ArmyBuilder } from '../RealmArmyBuilder';

type Props = {
  realm: GetRealmQuery['realm'];
  buildings?: number[];
  availableFood: number | undefined;
  attackHistory: any;
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
          <h2>{getRealmNameById(realm.realmId || 0)} Armies </h2>
          {!newArmyId && !selectedArmy && (
            <div>
              <Button
                onClick={() => setNewArmyId(onlyAttackingArmies.length + 1)}
                variant="outline"
              >
                Summon new Army ID {onlyAttackingArmies.length + 1}
              </Button>
            </div>
          )}
        </div>

        {onlyAttackingArmies.length > 0 && !newArmyId && !selectedArmy && (
          <div className="col-span-12">
            <div className="grid grid-cols-2 gap-4">
              {onlyAttackingArmies.map((army) => {
                return (
                  <ArmyCard
                    onBuildArmy={() => {
                      setSelectedArmy(army);
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

      {selectedArmy && (
        <div className="mt-10">
          <div className="flex justify-between">
            <h2>Army {selectedArmy.armyId}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedArmy(undefined)}
            >
              Back to Armies
            </Button>
          </div>
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
      {props.attackHistory &&
        props.attackHistory.map((a, index) => {
          return (
            <>
              <h3 className="mt-8 mb-4">Attack History</h3>
              <HistoryCard
                realmId={a.realmId}
                key={index}
                timeStamp={a.timestamp}
                eventId={a.eventId}
                event={`Army Raided Realm ${a.data.defendRealmId}`}
                action={''}
              >
                {a.eventType === realmMilitaryEvents.realmCombatAttack &&
                  (a.data.success ? (
                    <div className="flex">
                      <Sword className="w-6 mr-2" />
                      <span className="text-green-300">Successful Raid!</span>
                    </div>
                  ) : (
                    <div className="flex">
                      <Danger className="self-center w-6 h-6 fill-current" />
                      <span className="text-red-400">Raid Failed</span>
                    </div>
                  ))}
                {resourcePillaged(a.data?.pillagedResources)}
                {a.data?.relicLost && (
                  <span className="pl-10 text-xl font-semibold uppercase">
                    Relic {a.data?.relicLost}
                  </span>
                )}
                {/* } <Button
                size="xs"
                variant="primary"
                onClick={() => handleRaidDetailsClick(a)}
              >
                Raid Details
              </Button> */}
              </HistoryCard>
            </>
          );
        })}
    </div>
  );
};
