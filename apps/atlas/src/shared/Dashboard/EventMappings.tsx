import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import { GetRealmHistoryQuery } from '@/generated/graphql';
import { findResourceName } from '@/util/resources';
import { resourcePillaged } from '../Getters/Realm';

export const EventNa = {
  realmCombatAttack: 'realm_combat_attack',
  realmCombatDefend: 'realm_combat_defend',
  realmBuildingBuilt: 'realm_building_built',
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
            href={'/realm/' + event.data?.defendRealmId + '?tab=Army'}
          >
            Pillage and plunder again
          </Button>
        ) : (
          <Button
            size="xs"
            variant="outline"
            href={'/realm/' + event.data?.defendRealmId + '?tab=Army'}
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
            href={'/realm/' + event.data?.attackRealmId + '?tab=Army'}
          >
            Try again
          </Button>
        ) : (
          <Button
            size="xs"
            variant="outline"
            href={'/realm/' + event.data?.attackRealmId + '?tab=Army'}
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
          <Button
            size="xs"
            variant="outline"
            href={'/realm/' + event.realmId + '?tab=Survey'}
          >
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
