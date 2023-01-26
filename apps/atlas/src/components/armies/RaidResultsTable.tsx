import React from 'react';

import { battalionInformation, trueNameFromRawString } from '@/constants/army';
import { CombatImages } from '@/constants/globals';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { getRealmNameById, resourcePillaged } from '../realms/RealmsGetters';

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
    '"Greetings, my liege. I am writing to report on the recent battle that took place in the fields outside our kingdom. Our forces were met by a fierce enemy, but we were prepared and ready to meet them in combat. The battle raged on for hours, with both sides suffering heavy losses."';

  const failureText =
    "Greetings, my liege. I regret to inform you that our recent battle was not successful. Despite our best efforts, the enemy proved too strong and we were forced to retreat. Our army suffered heavy losses, and we were unable to hold our ground against the enemy's superior numbers and weaponry.";

  return (
    <div className="p-2 rounded bg-yellow-scroll">
      <div className="p-4 bg-gray-1000 rounded-xl">
        <img
          className="object-cover w-full rounded-xl"
          src={!success ? CombatImages.win : CombatImages.loss}
          alt=""
        />
        <div className="w-full my-3 text-center">
          <h1>{!success ? 'Victory' : 'Retreat'}</h1>
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
              <td className="text-2xl">
                {getRealmNameById(startingAttackingArmy?.realmId)}
                {' |  '}
                {startingAttackingArmy?.realmId}
              </td>
              <td>
                {startingAttackingArmy &&
                  formatArmy(startingAttackingArmy)
                    .filter((b) => b.quantity > 0)
                    .map((a, i) => {
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
                  )
                    .filter((b) => b.quantity > 0)
                    .map((a, i) => {
                      return (
                        <TroopCell key={i} id={a.name} quantity={a.quantity} />
                      );
                    })}
              </td>
              <td>
                {endingAttackingArmy &&
                  formatArmy(endingAttackingArmy)
                    .filter((b) => b.quantity > 0)
                    .map((a, i) => {
                      return (
                        <TroopCell key={i} id={a.name} quantity={a.quantity} />
                      );
                    })}
              </td>
            </tr>
          </tbody>
          <tbody className="bg-gray-900">
            <tr>
              <td className="text-2xl">
                {getRealmNameById(startingDefendingArmy?.realmId)}
                {' |  '}
                {startingDefendingArmy?.realmId}
              </td>
              <td>
                {startingDefendingArmy &&
                  formatArmy(startingDefendingArmy)
                    .filter((b) => b.quantity > 0)
                    .map((a, i) => {
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
                  )
                    .filter((b) => b.quantity > 0)
                    .map((a, i) => {
                      return (
                        <TroopCell key={i} id={a.name} quantity={a.quantity} />
                      );
                    })}
              </td>
              <td>
                {endingDefendingArmy &&
                  formatArmy(endingDefendingArmy)
                    .filter((b) => b.quantity > 0)
                    .map((a, i) => {
                      return (
                        <TroopCell key={i} id={a.name} quantity={a.quantity} />
                      );
                    })}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="w-full mt-3 text-center">
          <h1>Resources Plundered</h1>
          <div className="mx-auto">
            {resources && (
              <div className="flex">{resourcePillaged(resources)}</div>
            )}
          </div>
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
