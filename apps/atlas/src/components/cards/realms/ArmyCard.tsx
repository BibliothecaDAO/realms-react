import { Button } from '@bibliotheca-dao/ui-lib/base';
import type { Army } from '@/generated/graphql';

type Prop = {
  army: Army;
  onBuildArmy?: () => void;
  onTravel?: () => void;
};

export const ArmyCard: React.FC<Prop> = (props) => {
  const army = props.army;

  return (
    <div key={army.armyId} className="flex flex-col p-4 border col-1">
      <span className="uppercase">
        Location:{' '}
        {army?.destinationRealmId != 0 ? army?.destinationRealmId : 'Home'}
      </span>
      <span className="text-xl">Statistics</span>
      <span className="text-xl uppercase">Army {army.armyId}</span>
      <div className="grid grid-cols-2 gap-2">
        <Button
          disabled={
            army.destinationRealmId != 0 &&
            army.destinationRealmId != army.realmId
          }
          variant="primary"
          onClick={() => props.onBuildArmy && props.onBuildArmy()}
        >
          Recruit
        </Button>
        <Button
          variant="outline"
          onClick={() => props.onTravel && props.onTravel()}
        >
          Travel
        </Button>
      </div>
    </div>
  );
};
