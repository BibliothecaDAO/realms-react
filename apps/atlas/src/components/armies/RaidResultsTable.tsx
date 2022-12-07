import React from 'react';

import { battalionInformation } from '@/constants/army';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';

export const formatArmy = (army) => {
  const arr: any[] = [];
  battalionInformation.forEach((unit) => {
    if (army[unit.name + 'Qty'] > 0) {
      arr.push({ name: unit.name, quantity: army[unit.name + 'Qty'] });
    }
  });

  return arr;
};

interface RaidResultTableProps {
  startingAttackingArmy: ArmyAndOrder | undefined;
  endingAttackingArmy: ArmyAndOrder | undefined;
  startingDefendingArmy: ArmyAndOrder | undefined;
  endingDefendingArmy: ArmyAndOrder | undefined;
}

export const RaidResultTable = (props: RaidResultTableProps) => {
  const {
    startingAttackingArmy,
    endingAttackingArmy,
    startingDefendingArmy,
    endingDefendingArmy,
  } = props;

  console.log(
    startingAttackingArmy,
    endingAttackingArmy,
    startingDefendingArmy,
    endingDefendingArmy
  );

  // reduce two arrays to get the difference
  const getLosses = (startingArmy, endingArmy) => {
    const losses: any[] = [];

    for (let i = 0; i < startingArmy.length; i++) {
      const loss = startingArmy[i].quantity - endingArmy[i].quantity;

      losses.push({ name: startingArmy[i].name, quantity: loss });
    }

    return losses;
  };

  return (
    <div className="p-2 rounded-2xl bg-gray-1000">
      <table className="w-full">
        <thead>
          <tr className="text-2xl">
            <th>Lord</th>
            <th>Deployed</th>
            <th>Losses</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-2xl">lord</td>
            <td>
              {startingAttackingArmy &&
                formatArmy(startingAttackingArmy).map((a, i) => {
                  return (
                    <div key={i}>
                      {a.name} -{a.quantity}
                    </div>
                  );
                })}
            </td>
            <td>
              {endingAttackingArmy &&
                formatArmy(endingAttackingArmy).map((a, i) => {
                  return (
                    <div key={i}>
                      {a.name} -{a.quantity}
                    </div>
                  );
                })}
            </td>
            <td>
              {startingAttackingArmy &&
                endingAttackingArmy &&
                getLosses(
                  formatArmy(startingAttackingArmy),
                  formatArmy(endingAttackingArmy)
                ).map((a, i) => {
                  return (
                    <div key={i}>
                      {a.name} -{a.quantity}
                    </div>
                  );
                })}
            </td>
          </tr>
        </tbody>
        <tbody className="bg-gray-800">
          <tr>
            <td className="text-2xl">lord</td>
            <td>
              {startingDefendingArmy &&
                formatArmy(startingDefendingArmy).map((a, i) => {
                  return (
                    <div key={i}>
                      {a.name} - {a.quantity}
                    </div>
                  );
                })}
            </td>
            <td>
              {endingDefendingArmy &&
                formatArmy(endingDefendingArmy).map((a, i) => {
                  return (
                    <div key={i}>
                      {a.name} {a.quantity}
                    </div>
                  );
                })}
            </td>
            <td>
              {startingDefendingArmy &&
                endingDefendingArmy &&
                getLosses(
                  formatArmy(startingDefendingArmy),
                  formatArmy(endingDefendingArmy)
                ).map((a, i) => {
                  return (
                    <div key={i}>
                      {a.name} {a.quantity}
                    </div>
                  );
                })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
