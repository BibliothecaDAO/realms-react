import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Shield from '@bibliotheca-dao/ui-lib/icons/shield.svg';
import { ArmyBattalions } from './armyCard/ArmyBattalions';
import { ArmyStatisticsTable } from './armyCard/ArmyStatisticsTable';
import { getArmyById, GetArmyStrength } from './ArmyGetters';

export const ArmyToolTip = ({ army }) => {
  return (
    <Tooltip
      placement="left"
      className="z-10 flex"
      tooltipText={
        <div className="p-2 text-sm rounded bg-gray-1000 whitespace-nowrap">
          <ArmyStatisticsTable army={army} />
          <ArmyBattalions army={army} />
        </div>
      }
    >
      <div className="flex">
        <Shield className={'w-7 fill-gray-500 mr-2'} />
        <span className="w-full break-normal">{GetArmyStrength(army)}</span>
      </div>
    </Tooltip>
  );
};
