import { useArmy } from '@/hooks/settling/useArmy';

export const ArmyStatisticsTable = ({ army }) => {
  const { getArmyStats } = useArmy();

  const armyStats = getArmyStats(army);
  return (
    <div className="p-3 border rounded-1 border-white/20">
      <div className="flex justify-between">
        <h5 className="font-semibold">Statistics</h5>
        <span className="pr-6 ml-auto">A</span> <span>D</span>
      </div>
      <hr className="border-white/30" />
      <div className="flex justify-between">
        Cavalry <span className="pr-3 ml-auto">{armyStats.cavalryAttack}</span>{' '}
        <span>{armyStats.cavalryDefence}</span>
      </div>
      <div className="flex justify-between">
        Archery <span className="pr-3 ml-auto">{armyStats.archeryAttack}</span>{' '}
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
  );
};
