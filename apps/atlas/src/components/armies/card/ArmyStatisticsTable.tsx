import { useArmy } from '@/hooks/settling/useArmy';
import { armyStrength, armyStrengthColors } from '../ArmyGetters';

export const ArmyStatisticsTable = ({ army }) => {
  const { getArmyStats } = useArmy();

  const armyStats = getArmyStats(army);

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
    <div className="p-1 border bg-gray-1000 rounded-1 border-white/20">
      <table className="w-full">
        <thead>
          <tr className="text-left border border-white/30">
            <th className="w-1/2 px-1 border border-white/30">Battlions</th>
            <th className="w-1/4 px-1 border border-white/30">Attack</th>
            <th className="w-1/4 px-1 border border-white/30">Defence</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => {
            return (
              <tr className="border border-white/30" key={index}>
                <td className="px-1 border border-white/30 ">{row.name}</td>
                <td
                  className={`${armyStrengthColors(
                    row.attack
                  )} px-1 border border-white/30`}
                >
                  {' '}
                  {armyStrength(row.attack)}
                </td>
                <td
                  className={`${armyStrengthColors(
                    row.defence
                  )} px-1 border border-white/30`}
                >
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
