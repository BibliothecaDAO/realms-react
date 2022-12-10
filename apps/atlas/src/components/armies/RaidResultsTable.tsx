import React from 'react';

import { battalionInformation, trueNameFromRawString } from '@/constants/army';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { resourcePillaged } from '../realms/RealmsGetters';

export const formatArmy = (army) => {
  const arr: any[] = [];
  battalionInformation.forEach((unit) => {
    arr.push({
      name: trueNameFromRawString(unit.name),
      quantity: army[unit.name + 'Qty'],
    });
  });

  return arr;
};

interface RaidResultTableProps {
  startingAttackingArmy: ArmyAndOrder | undefined;
  endingAttackingArmy: ArmyAndOrder | undefined;
  startingDefendingArmy: ArmyAndOrder | undefined;
  endingDefendingArmy: ArmyAndOrder | undefined;
  relic?: string;
  resources: any;
  success: boolean;
}

export const RaidResultTable = (props: RaidResultTableProps) => {
  const {
    startingAttackingArmy,
    endingAttackingArmy,
    startingDefendingArmy,
    endingDefendingArmy,
    relic,
    resources,
    success,
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

      losses.push({
        name: startingArmy[i].name,
        quantity: loss,
      });
    }

    return losses;
  };

  const successText =
    '"Greetings, my liege. I am writing to report on the recent battle that took place in the fields outside our kingdom. Our forces were met by a fierce enemy, but we were prepared and ready to meet them in combat. The battle raged on for hours, with both sides suffering heavy losses. However, in the end, our troops emerged victorious, thanks to their bravery and skill. The enemy was vanquished and our kingdom remains safe. We have taken many prisoners and recovered much in the way of spoils. Our casualties were significant, but we have already begun to rebuild and prepare for any future threats. I am proud to have led such a valiant group of warriors, and I pledge to continue to serve and protect our kingdom to the best of my ability. Long live the king!"';

  const failureText =
    "Greetings, my liege. I regret to inform you that our recent battle was not successful. Despite our best efforts, the enemy proved too strong and we were forced to retreat. Our army suffered heavy losses, and we were unable to hold our ground against the enemy's superior numbers and weaponry. We have regrouped and are currently in retreat, making our way back to our kingdom in the hopes of regrouping and finding a way to overcome this setback. We will continue to fight and do all that we can to protect our kingdom, but I must be honest and admit that the situation is dire. I will continue to do all that I can to lead our forces and turn the tide of this conflict, but I ask for your continued support and guidance. May the gods be with us in these trying times.";

  return (
    <div className="p-3 border-4 border-yellow-800 border-double rounded-2xl bg-gray-1000">
      <img
        className="object-cover w-full rounded-xl"
        src={'/backgrounds/combat_4.png'}
        alt=""
      />
      <div className="w-full my-3 text-center">
        <h1>Battle report</h1>
      </div>

      <div className="p-3 mb-4 text-xl text-center">
        <p>{!success ? successText : failureText}</p>
      </div>

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
                    <TroopCell key={i} id={a.name} quantity={a.quantity} />
                  );
                })}
            </td>
            <td>
              {endingAttackingArmy &&
                formatArmy(endingAttackingArmy).map((a, i) => {
                  return (
                    <TroopCell key={i} id={a.name} quantity={a.quantity} />
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
                    <TroopCell key={i} id={a.name} quantity={a.quantity} />
                  );
                })}
            </td>
          </tr>
        </tbody>
        <tbody className="bg-gray-900">
          <tr>
            <td className="text-2xl">lord</td>
            <td>
              {startingDefendingArmy &&
                formatArmy(startingDefendingArmy).map((a, i) => {
                  return (
                    <TroopCell key={i} id={a.name} quantity={a.quantity} />
                  );
                })}
            </td>
            <td>
              {endingDefendingArmy &&
                formatArmy(endingDefendingArmy).map((a, i) => {
                  return (
                    <TroopCell key={i} id={a.name} quantity={a.quantity} />
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
                    <TroopCell key={i} id={a.name} quantity={a.quantity} />
                  );
                })}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="w-full my-3 text-center">
        <h1>Resources Plunded</h1>
        <div className="mx-auto">
          {resources && (
            <div className="flex">{resourcePillaged(resources)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TroopCell = ({ id, quantity }) => {
  return (
    <div className="w-full text-xl text-center">
      {quantity} x {id}
    </div>
  );
};
