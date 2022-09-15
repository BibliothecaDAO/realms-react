import { Button } from '@bibliotheca-dao/ui-lib/base';
import type { Army } from '@/generated/graphql';

type Prop = {
  army: Army;
  onBuildArmy: () => void;
};

export const ArmyCard: React.FC<Prop> = (props) => {
  const army = props.army;

  return (
    <div key={army.armyId} className="flex flex-col p-4 border col-1">
      <span className="uppercase">Location: In Transit to X</span>
      <span className="text-xl">Statistics</span>
      <span className="text-xl uppercase">Army {army.armyId}</span>
      <div className="grid grid-cols-2 gap-2">
        <Button
          disabled={
            army.visitingRealmId != 0 && army.visitingRealmId != army.realmId
          }
          variant="primary"
          onClick={() => props.onBuildArmy()}
        >
          Recruit
        </Button>
        <Button variant="outline">Travel</Button>
      </div>
    </div>
  );
};
