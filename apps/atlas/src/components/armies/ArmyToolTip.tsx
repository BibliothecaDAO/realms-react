import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Shield from '@bibliotheca-dao/ui-lib/icons/shield.svg';
import { getArmyById, GetArmyStrength } from './ArmyGetters';
import { ArmyBattalions } from './card/ArmyBattalions';
import { ArmyStatisticsTable } from './card/ArmyStatisticsTable';

export const ArmyToolTip = ({ army }) => {
  return (
    <Tooltip
      placement="left"
      className="flex z-100"
      tooltipText={
        <div className="p-2 text-sm rounded bg-gray-1000 whitespace-nowrap">
          <ArmyStatisticsTable army={army} />
          <ArmyBattalions army={army} />
        </div>
      }
    >
      <div className="flex justify-start">
        <Shield className={'w-7 fill-gray-500 mr-2'} />
        <span className="break-normal">{GetArmyStrength(army)}</span>
      </div>
    </Tooltip>
  );
};
