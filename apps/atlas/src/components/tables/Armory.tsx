import { Button, ResourceIcon, Table } from '@bibliotheca-dao/ui-lib/base';
import { Switch } from '@headlessui/react';
import Image from 'next/image';
import { useEffect, useReducer, useState } from 'react';
import { buildingIdToString } from '@/constants/buildings';
import { Squad, TroopTierMax } from '@/constants/index';
import { TroopBuildings } from '@/constants/troops';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { GetTroopStatsQuery } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { Entrypoints } from '@/hooks/settling/useBuildings';
import { CostBlock } from '@/shared/Getters/Realm';
import type { ItemCost, TroopInterface } from '@/types/index';
import { findResourceName } from '@/util/resources';

interface Props {
  realmId: number;
  statistics: TroopInterface[];
  hideSquadToggle?: boolean;
  filterTier?: number;
  troopsQueued: TroopInterface[];
  troops: TroopInterface[];
  squad: keyof typeof Squad;
  onBuildTroop?: (t: TroopInterface) => void;
  militaryBuildingsBuilt: Array<number> | undefined;
}
const columns = [
  { Header: 'name', id: 1, accessor: 'name' },
  { Header: 'cost', id: 6, accessor: 'troopCost' },
  { Header: 'action', id: 6, accessor: 'add' },
];

const tableOptions = { is_striped: true };

type Row = {
  name: JSX.Element;
  troopCost: JSX.Element;
};
export const ArmoryBuilder = (props: Props) => {
  const [tier, setTier] = useState(1);

  const filteredTroops =
    tier !== undefined
      ? props.statistics.filter((v) => v.tier == tier)
      : props.statistics;

  const filteredCurrentTroops = props.troops.filter((v) => v.tier == tier);

  const filteredQueuedTroops = props.troopsQueued.filter((v) => v.tier == tier);

  const reachedMaxNumberOfTroopsInTier =
    tier != undefined &&
    filteredCurrentTroops.length + filteredQueuedTroops.length >=
      TroopTierMax[tier - 1];

  const txQueue = useTransactionQueue();
  const [buildingIdsEnqueued, setBuildingIdsEnqueued] = useState<number[]>([]);
  useEffect(() => {
    setBuildingIdsEnqueued(
      txQueue.transactions
        .filter(
          (tx) =>
            tx.contractAddress == ModuleAddr.Building &&
            tx.entrypoint == Entrypoints.build &&
            tx.metadata['realmId'] == props.realmId
        )
        .map((t) => t.metadata['buildingId'])
    );
  }, [txQueue.transactions]);

  const checkCanBuilt = (id) => {
    const militaryBuildings = props.militaryBuildingsBuilt ?? [];
    return militaryBuildings.concat(buildingIdsEnqueued).filter((a) => a === id)
      .length > 0
      ? false
      : true;
  };

  const mappedRowData: Row[] = filteredTroops.map((re, index) => {
    return {
      name: (
        <span className="flex p-1">
          <div
            className={`flex w-1/3 p-2 border-4 border-double rounded-xl border-white/40 ${re.troopColour}`}
          >
            <Image
              height={100}
              width={100}
              className="self-center object-contain h-auto"
              src={`/realm-troops/${re.troopName}.png`}
              alt=""
            />
          </div>
          <div className="w-2/3 px-4 py-2">
            <div className="text-2xl font-display"> {re.troopName}</div>
            <div className="text-xs tracking-widest uppercase opacity-80">
              <div>Agility: {re.agility}</div>
              <div>Attack: {re.attack}</div>
              <div>Armor: {re.armor}</div>
              <div>Vitality: {re.vitality}</div>
              <div>Wisdom: {re.wisdom}</div>
            </div>
          </div>
        </span>
      ),
      troopCost: (
        <div className="flex flex-col my-4 text-center">
          {re.troopCost?.resources.map((a, index) => {
            return (
              <CostBlock
                key={index}
                resourceName={a.resourceName}
                amount={a.amount}
                id={a.resourceId}
                qty={1}
              />
            );
          })}
        </div>
      ),
      add: (
        <div>
          <Button
            disabled={
              reachedMaxNumberOfTroopsInTier ||
              checkCanBuilt(TroopBuildings[re.troopName ?? ''])
            }
            variant="primary"
            size="xs"
            onClick={() => {
              props.onBuildTroop &&
                props.onBuildTroop({
                  ...re,
                  squadSlot: Squad[props.squad],
                  index,
                });
            }}
          >
            {reachedMaxNumberOfTroopsInTier ? 'max troop tier' : 'add'}
          </Button>
          {checkCanBuilt(TroopBuildings[re.troopName ?? '']) && (
            <p className="mt-4">
              Requires {buildingIdToString(TroopBuildings[re.troopName ?? ''])}
            </p>
          )}
        </div>
      ),
    };
  });

  const [armyType, toggleArmyType] = useReducer(
    (state: 'attacking' | 'defending') => {
      return state === 'defending' ? 'attacking' : 'defending';
    },
    'attacking'
  );

  const isAttack = armyType === 'attacking';
  const isDefend = armyType === 'defending';

  return (
    <div className="w-full">
      {!props.hideSquadToggle && (
        <div className="flex space-x-2">
          {/* <input
            className="w-full px-3 py-2 text-sm font-bold leading-tight tracking-widest uppercase transition-all duration-300 rounded shadow-md appearance-none h-9 focus:outline-none bg-gray-800/40 hover:bg-gray-300/20"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder={'Realm ID'}
          /> */}
          <div className="flex self-center">
            <div
              className={`px-4 uppercase ${
                armyType === 'attacking' && 'font-semibold'
              }`}
            >
              Attacking
            </div>
            <Switch
              checked={isAttack}
              onChange={toggleArmyType}
              className={`${
                isAttack ? 'bg-green-600' : 'bg-blue-600'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Army Switch</span>
              <span
                className={`${
                  isDefend ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
            <div className={`px-4 uppercase ${isDefend && 'font-semibold'}`}>
              Defending
            </div>
          </div>
        </div>
      )}

      <div className="my-4 overflow-y-scroll">
        <div className="flex justify-center mb-3 space-x-3">
          <Button
            variant={tier === 1 ? 'primary' : 'outline'}
            onClick={() => setTier(1)}
          >
            tier 1
          </Button>
          <Button
            variant={tier === 2 ? 'primary' : 'outline'}
            onClick={() => setTier(2)}
          >
            tier 2
          </Button>
          <Button
            variant={tier === 3 ? 'primary' : 'outline'}
            onClick={() => setTier(3)}
          >
            tier 3
          </Button>
        </div>

        {mappedRowData && (
          <Table
            columns={columns}
            data={mappedRowData}
            options={tableOptions}
          />
        )}
      </div>
    </div>
  );
};
