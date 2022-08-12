import { Button, ResourceIcon, Table } from '@bibliotheca-dao/ui-lib/base';
import { Switch } from '@headlessui/react';
import Image from 'next/image';
import { useReducer } from 'react';
import { Squad, TroopTierMax } from '@/constants/index';
import type { GetTroopStatsQuery } from '@/generated/graphql';
import type { ItemCost, TroopInterface } from '@/types/index';
import { findResourceName } from '@/util/resources';

interface Props {
  realmId: number;
  statistics: GetTroopStatsQuery['getTroopStats'];
  hideSquadToggle?: boolean;
  filterTier?: number;
  troopsQueued: TroopInterface[];
  troops: TroopInterface[];
  squad: keyof typeof Squad;
  onBuildTroop?: (t: TroopInterface) => void;
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
  const troopCostCell = (cost: ItemCost) => {
    return (
      <div className="flex flex-col">
        {cost.resources.map((a, index) => {
          return (
            <div key={index} className="flex w-full my-3 text-2xl">
              <ResourceIcon
                resource={
                  findResourceName(a.resourceId)?.trait.replace(' ', '') || ''
                }
                size="md"
                className="self-center mr-4"
              />
              <span>{a.amount}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const filteredTroops =
    props.filterTier !== undefined
      ? props.statistics.filter((v) => v.tier == props.filterTier)
      : props.statistics;

  const filteredCurrentTroops = props.troops.filter(
    (v) => v.tier == props.filterTier
  );

  const filteredQueuedTroops = props.troopsQueued.filter(
    (v) => v.tier == props.filterTier
  );

  const reachedMaxNumberOfTroopsInTier =
    props.filterTier != undefined &&
    filteredCurrentTroops.length + filteredQueuedTroops.length >=
      TroopTierMax[props.filterTier - 1];

  const mappedRowData: Row[] = filteredTroops.map((re, index) => {
    return {
      name: (
        <span className="flex p-1">
          <div className="flex w-1/3 p-2 bg-red-700 border-4 border-double rounded-xl border-white/40">
            <Image
              height={100}
              width={100}
              className="self-center object-contain h-auto"
              src={`/realm-troops/${re.troopName}.png`}
              alt=""
            />
          </div>
          <div className="w-2/3 px-4 py-2">
            <div className="text-xl font-display"> {re.troopName}</div>
            <div>Agility: {re.agility}</div>
            <div>Attack: {re.attack}</div>
            <div>Armor: {re.armor}</div>
            <div>Vitality: {re.vitality}</div>
            <div>Wisdom: {re.wisdom}</div>
          </div>
        </span>
      ),
      troopCost: troopCostCell(re.troopCost!),
      add: (
        <Button
          disabled={reachedMaxNumberOfTroopsInTier}
          variant="primary"
          size="md"
          onClick={() => {
            props.onBuildTroop &&
              props.onBuildTroop({
                ...re,
                squadSlot: Squad[props.squad],
                index,
              });
          }}
        >
          train
        </Button>
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
            className="w-full px-3 py-2 text-sm font-bold leading-tight tracking-widest text-white uppercase transition-all duration-300 rounded shadow-md appearance-none h-9 focus:outline-none bg-gray-800/40 hover:bg-gray-300/20"
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
