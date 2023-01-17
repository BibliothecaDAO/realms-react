import type { Army } from '@/generated/graphql';

type Props = {
  army: Army;
};

export const ArmyBattalions = (props: Props) => {
  const { army } = props;

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
              qty={army.lightCavalryQty}
              name="Cavalry"
              health={army.lightCavalryHealth}
            />
            <Row
              qty={army.heavyCavalryQty}
              name="Knights"
              health={army.heavyCavalryHealth}
            />
            <Row
              qty={army.archerQty}
              name="Archers"
              health={army.archerHealth}
            />
            <Row
              qty={army.longbowQty}
              name="Longbow"
              health={army.longbowHealth}
            />
            <Row
              qty={army.mageQty}
              name="Apprentice"
              health={army.mageHealth}
            />
            <Row
              qty={army.arcanistQty}
              name="Archanist"
              health={army.arcanistHealth}
            />
            <Row
              qty={army.lightInfantryQty}
              name="Solider"
              health={army.lightInfantryHealth}
            />
            <Row
              qty={army.heavyInfantryQty}
              name="Paladin"
              health={army.heavyInfantryHealth}
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
