import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import { GetRealmHistoryQuery } from '@/generated/graphql';
import { findResourceName } from '@/util/resources';

export const EventNa = {
  realmCombatAttack: 'realm_combat_attack',
  realmCombatDefend: 'realm_combat_defend',
  realmBuildingBuilt: 'realm_building_built',
  realmCombatAttack: 'realm_combat_attack',
};

const resourcePillaged = (resources: any) => {
  return (
    <div className="my-4">
      {resources.map((resource, index) => {
        const info = findResourceName(resource.resourceId);
        return (
          <div className="flex justify-between my-1 text-white" key={index}>
            <div className="flex w-full">
              <ResourceIcon
                size="xs"
                className="self-center"
                resource={info?.trait?.replace('_', '') as string}
              />{' '}
              <span className="self-center ml-4 font-semibold uppercase">
                {info?.trait}
              </span>
            </div>

            <span className="self-center ml-4 font-semibold uppercase">
              {(+formatEther(resource.amount)).toFixed()} units
            </span>
          </div>
        );
      })}
    </div>
  );
};

const successClass = '';
const negativeClass = '';
export function genMilitaryRealmEvent(event) {
  switch (event.eventType) {
    case 'realm_combat_attack':
      return {
        event: event.data?.success ? (
          <span className="">
            Raid successful on Realm {event.data?.defendRealmId}
          </span>
        ) : (
          `Unsuccessful Raid`
        ),
        class: event.data?.success ? successClass : negativeClass,
        resources: resourcePillaged(event.data?.pillagedResources),
        action: event.data?.success ? (
          <Button
            size="xs"
            variant="outline"
            href={'/ream/' + event.data?.defendRealmId}
          >
            Pillage and plunder again
          </Button>
        ) : (
          <Button
            size="xs"
            variant="outline"
            href={'/ream/' + event.data?.defendRealmId}
          >
            Try again
          </Button>
        ),
      };
    case 'realm_combat_defend':
      return {
        event: event.data?.success ? (
          <span className="">
            We have been Pillaged by Realm {event.data?.attackRealmId}
          </span>
        ) : (
          <span className="">
            Defended raid from {event.data?.defendRealmId}
          </span>
        ),
        class: event.data?.success ? successClass : negativeClass,
        resources: resourcePillaged(event.data?.pillagedResources),
        action: event.data?.success ? (
          <Button
            size="xs"
            variant="outline"
            href={'/ream/' + event.data?.attackRealmId}
          >
            Try again
          </Button>
        ) : (
          <Button
            size="xs"
            variant="outline"
            href={'/ream/' + event.data?.attackRealmId}
          >
            muster the troops!
          </Button>
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
export function genEconomicRealmEvent(event) {
  switch (event.eventType) {
    case 'realm_building_built':
      return {
        event: `Built ${event.data?.buildingName}`,
        class: successClass,
        action: '',
      };
    case 'realm_resource_upgraded':
      return {
        event: `Upgraded ${event.data?.resourceName} to Level ${event.data?.level}`,
        class: successClass,
        action: '',
      };
    case 'realm_mint':
      return {
        event: `Minted Realm ${event.realmId}`,
        class: successClass,
        action: (
          <Button size="xs" variant="outline" href={'/ream/' + event.realmId}>
            Manage Realm
          </Button>
        ),
      };
    case 'realm_settle':
      return {
        event: 'Settled',
        class: successClass,
        action: '',
      };
    case 'realm_unsettle':
      return {
        event: 'Unsettled',
        class: successClass,
        action: '',
      };
    default:
      return {
        event: '',
        class: '',
        action: '',
      };
  }
}
