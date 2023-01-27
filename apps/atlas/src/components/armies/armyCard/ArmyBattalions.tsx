import { BattalionIds, battalionIdToString } from '@/constants/army';
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
          <hr className="border-white/30" />
          <tbody>
            <Row
              qty={army.lightCavalryQty}
              name={battalionIdToString(BattalionIds.LightCavalry)}
              health={army.lightCavalryHealth}
            />
            <Row
              qty={army.heavyCavalryQty}
              name={battalionIdToString(BattalionIds.HeavyCavalry)}
              health={army.heavyCavalryHealth}
            />
            <Row
              qty={army.archerQty}
              name={battalionIdToString(BattalionIds.Archer)}
              health={army.archerHealth}
            />
            <Row
              qty={army.longbowQty}
              name={battalionIdToString(BattalionIds.Longbow)}
              health={army.longbowHealth}
            />
            <Row
              qty={army.mageQty}
              name={battalionIdToString(BattalionIds.Mage)}
              health={army.mageHealth}
            />
            <Row
              qty={army.arcanistQty}
              name={battalionIdToString(BattalionIds.Arcanist)}
              health={army.arcanistHealth}
            />
            <Row
              qty={army.lightInfantryQty}
              name={battalionIdToString(BattalionIds.LightInfantry)}
              health={army.lightInfantryHealth}
            />
            <Row
              qty={army.heavyInfantryQty}
              name={battalionIdToString(BattalionIds.HeavyInfantry)}
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
    <tr className={`${qty > 0 ? 'text-green-500' : ''}`}>
      <td className="text-left">{name}</td>
      <td className={`text-right`}>{qty}</td>
      <td className="text-right">{health}</td>
    </tr>
  );
};
