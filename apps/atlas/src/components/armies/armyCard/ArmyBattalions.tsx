import type { Army } from '@/generated/graphql';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';

export interface ArmyAndOrder extends Army {
  orderType?: string;
}

type Prop = {
  army: ArmyAndOrder;
  onBuildArmy?: () => void;
  onTravel?: () => void;
  selectedRealm?: number;
  isAtLocation: boolean;
  isHome: boolean;
};

export const ArmyBattalions: React.FC<Prop> = (props) => {
  const { play } = useUiSounds(soundSelector.pageTurn);
  const army = props.army;

  return (
    <div key={army.armyId}>
      <div className="w-full mt-3">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Battalion</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Health</th>
            </tr>
          </thead>
          <tbody>
            <Row
              qty={props.army.lightCavalryQty}
              name="Cavalry"
              health={props.army.lightCavalryHealth}
            />
            <Row
              qty={props.army.heavyCavalryQty}
              name="Knights"
              health={props.army.heavyCavalryHealth}
            />
            <Row
              qty={props.army.archerQty}
              name="Archers"
              health={props.army.archerHealth}
            />
            <Row
              qty={props.army.longbowQty}
              name="Longbow"
              health={props.army.longbowHealth}
            />
            <Row
              qty={props.army.mageQty}
              name="Apprentice"
              health={props.army.mageHealth}
            />
            <Row
              qty={props.army.arcanistQty}
              name="Archanist"
              health={props.army.arcanistHealth}
            />
            <Row
              qty={props.army.lightInfantryQty}
              name="Solider"
              health={props.army.lightInfantryHealth}
            />
            <Row
              qty={props.army.heavyInfantryQty}
              name="Paladin"
              health={props.army.heavyInfantryHealth}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Row = ({ qty, health, name }) => {
  return (
    <tr>
      <td className="text-left">{name}</td>
      <td className="text-right">{qty}</td>
      <td className="text-right">{health}</td>
    </tr>
  );
};