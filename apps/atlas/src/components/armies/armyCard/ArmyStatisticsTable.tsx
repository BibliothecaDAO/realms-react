import { Table } from '@bibliotheca-dao/ui-lib/base';
import { useArmy } from '@/hooks/settling/useArmy';
import { armyStrength, armyStrengthColors } from '../ArmyGetters';

export const ArmyStatisticsTable = ({ army }) => {
  const { getArmyStats } = useArmy();

  const armyStats = getArmyStats(army);

  const columns = [
    { Header: 'Name', id: 1, accessor: 'name' },
    { Header: 'attack', id: 2, accessor: 'attack' },
    // { Header: 'Distance', id: 3, accessor: 'distance' },
    { Header: 'defence', id: 3, accessor: 'defence' },
    { Header: 'strength', id: 4, accessor: 'strength' },
  ];
  const tableOptions = { is_striped: false };

  const statistics = [
    {
      battalion: 'Cavalry',
      attack: armyStats.cavalryAttack,
      defence: armyStats.cavalryDefence,
    },
    {
      battalion: 'Archery',
      attack: armyStats.archeryAttack,
      defence: armyStats.archeryDefence,
    },
    {
      battalion: 'Magic',
      attack: armyStats.magicAttack,
      defence: armyStats.magicDefence,
    },
    {
      battalion: 'Infantry',
      attack: armyStats.infantryAttack,
      defence: armyStats.infantryDefence,
    },
  ];

  const table = statistics.map((statistic) => {
    return {
      name: statistic.battalion,
      attack: statistic.attack,
      defence: statistic.defence,
      strength: 'Archers',
    };
  });

  return (
    <div className="p-3 border bg-gray-1000 rounded-1 border-white/20">
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="w-1/2">Battlions</th>
            <th className="w-1/4">Attack</th>
            <th className="w-1/4">Defence</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => {
            return (
              <tr key={index}>
                <td>{row.name}</td>
                <td className={armyStrengthColors(row.attack)}>
                  {' '}
                  {armyStrength(row.attack)}
                </td>
                <td className={armyStrengthColors(row.defence)}>
                  {armyStrength(row.defence)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
