import { Button } from '@bibliotheca-dao/ui-lib';

import {
  getRealmNameById,
  resourcePillaged,
} from '@/components/realms/RealmsGetters';
import { ArmyBattalions } from '../armies/armyCard/ArmyBattalions';

export const Event = {
  realmCombatAttack: 'realm_combat_attack',
  realmCombatDefend: 'realm_combat_defend',
  realmBuildingBuilt: 'realm_building_built',
  realmTransfer: 'realm_transfer',
  realmSettle: 'realm_settle',
  realmUnsettle: 'realm_unsettle',
  armyTravel: 'army_travel',
  foodHarvest: 'food_harvest',
  foodCreated: 'food_created',
  armyBuild: 'army_built',
};

export const EventImages = {
  [Event.realmCombatAttack]: '/vizirs/mj_military_vizir.png',
  [Event.realmCombatDefend]: '/vizirs/mj_military_vizir.png',
  [Event.realmBuildingBuilt]: '/vizirs/mj_builder.png',
  [Event.realmTransfer]: '/vizirs/mj_builder.png',
  [Event.realmSettle]: '/vizirs/mj_builder.png',
  [Event.realmUnsettle]: '/vizirs/mj_builder.png',
  [Event.armyTravel]: '/vizirs/mj_travel.png',
  [Event.foodHarvest]: '/realm-buildings/mj_farm.png',
  [Event.foodCreated]: '/realm-buildings/mj_farm.png',
  [Event.armyBuild]: '/vizirs/mj_military_vizir.png',
};

const successClass = '';
const negativeClass = '';

export const checkTimeInPast = (time: number) => {
  return time < Date.now();
};

export const VisitButton = (id) => {
  return (
    <Button size="xs" variant="outline" href={'/?asset=realm' + id}>
      Visit realm
    </Button>
  );
};

export function generateRealmEvent(event, user?: boolean) {
  switch (event.eventType) {
    case Event.realmCombatAttack:
      return {
        event: (
          <div>
            <span className="">
              {event.data?.success
                ? `Raid successful on ${getRealmNameById(
                    event.data?.defendRealmId
                  )}!`
                : `Raid failed on ${getRealmNameById(
                    event.data?.defendRealmId
                  )}`}
            </span>
          </div>
        ),
        class: event.data?.success ? successClass : negativeClass,
        resources: resourcePillaged(event.data?.pillagedResources),
        txHash: event.transactionHash,
        attackRealmId: event.data?.attackRealmId,
        image: EventImages[event.eventType],
        relic: event.data?.relicClaimed ? (
          <span className="text-xl">
            Captured Relic {event.data?.relicClaimed}!
          </span>
        ) : null,
        action: (
          <Button
            size="sm"
            variant="outline"
            href={'/?asset=realm' + event.data?.defendRealmId}
          >
            {event.data?.success ? 'Pillage and plunder again' : 'try again'}
          </Button>
        ),
      };

    case Event.realmCombatDefend:
      if (user) {
        return {
          event: (
            <span>
              {event.data?.success
                ? `Defended raid from ${getRealmNameById(
                    event.data?.attackRealmId
                  )}`
                : `We have been Pillaged by Realm ${getRealmNameById(
                    event.data?.attackRealmId
                  )}`}
            </span>
          ),
          class: event.data?.success ? successClass : negativeClass,
          resources: resourcePillaged(event.data.pillagedResources),
          image: EventImages[event.eventType],
          relic: event.data?.relicLost ? (
            <span className="pl-10 text-xl font-semibold uppercase">
              Relic {event.data?.relicLost}
            </span>
          ) : null,
          txHash: event.transactionHash,
          attackRealmId: event.data?.attackRealmId,
          action: (
            <Button
              size="xs"
              variant="outline"
              href={'/?asset=realm' + event.data?.attackRealmId}
            >
              {event.data?.success ? 'Try again' : 'summon the troops!'}
            </Button>
          ),
        };
      } else {
        return {
          event: (
            <span>
              {event.data?.success
                ? `Defended raid from ${event.data?.attackRealmId}`
                : `Realm Pillaged by Realm ${event.data?.attackRealmId}`}
            </span>
          ),
          class: event.data?.success ? successClass : negativeClass,
          resources: resourcePillaged(event.data?.pillagedResources),
          image: EventImages[event.eventType],
          relic: event.data?.relicLost ? (
            <span className="pl-10 text-xl font-semibold uppercase">
              Relic {event.data?.relicLost}
            </span>
          ) : null,
          txHash: event.transactionHash,
          attackRealmId: event.data?.attackRealmId,
          action: (
            <Button
              size="xs"
              variant="outline"
              href={'/?asset=realm' + event.data?.attackRealmId}
            >
              {event.data?.success ? 'Retaliate' : 'summon the troops!'}
            </Button>
          ),
        };
      }
    case Event.realmBuildingBuilt:
      return {
        event: `Built ${event.data?.buildingName}`,
        image: EventImages[event.eventType],
        class: successClass,
        action: <VisitButton id={event.realmId} />,
      };
    case Event.realmSettle:
      return {
        event: 'Settled',
        class: successClass,
        image: EventImages[event.eventType],
        action: <VisitButton id={event.realmId} />,
      };
    case Event.realmUnsettle:
      return {
        event: 'Unsettled',
        class: successClass,
        image: EventImages[event.eventType],
        action: <VisitButton id={event.realmId} />,
      };
    case Event.armyTravel:
      return {
        event: `${getRealmNameById(event.data?.originRealmId)} Army Travel`,
        class: successClass,
        image: EventImages[event.eventType],
        action: (
          <div>
            {checkTimeInPast(event.data?.destinationArrivalTime) ? (
              <p className="mb-4">
                Your Army from {getRealmNameById(event.data?.originRealmId)} has
                arrived at {getRealmNameById(event.data?.destinationRealmId)}
              </p>
            ) : (
              <p>
                <p className="mb-4">
                  Your Army from {getRealmNameById(event.data?.originRealmId)}{' '}
                  will arrive at{' '}
                  {getRealmNameById(event.data?.destinationRealmId)} by{' '}
                  {new Date(
                    event.data?.destinationArrivalTime
                  ).toLocaleTimeString('en-US')}
                </p>
              </p>
            )}
            <VisitButton id={event.data?.destinationRealmId} />,
          </div>
        ),
      };
    case Event.foodHarvest:
      return {
        event: `${event.data.buildingName} Harvested on ${getRealmNameById(
          event.realmId
        )}`,
        image: EventImages[event.eventType],
        class: successClass,
        action: (
          <div>
            <span>Harvested: {event.data.qty}</span> <br />
            <span>Harvests Remaining: {event.data.harvests}</span> <br />
            <VisitButton id={event.realmId} />
          </div>
        ),
      };
    case Event.foodCreated:
      return {
        event: `${event.data.buildingName} created on ${getRealmNameById(
          event.realmId
        )}`,
        image: EventImages[event.eventType],
        class: successClass,
        action: (
          <div>
            <span>Created: {event.data.qty}</span> <br />
            <span>Harvests Remaining: {event.data.harvests}</span> <br />
            <VisitButton id={event.realmId} />
          </div>
        ),
      };
    case Event.armyBuild:
      return {
        event: `Army update on ${getRealmNameById(event.realmId)}`,
        image: EventImages[event.eventType],
        class: successClass,
        action: (
          <div>
            <ArmyBattalions army={event.data} />
            <VisitButton id={event.realmId} />
          </div>
        ),
      };
    default:
      return {
        event: '',
        class: '',
        action: '',
      };
  }
}
