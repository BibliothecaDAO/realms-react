import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import Image from 'next/image';
import { GetRealmHistoryQuery } from '@/generated/graphql';
import { findResourceName } from '@/util/resources';
import { resourcePillaged } from '../Getters/Realm';

export const Event = {
  realmCombatAttack: 'realm_combat_attack',
  realmCombatDefend: 'realm_combat_defend',
  realmBuildingBuilt: 'realm_building_built',
  realmTransfer: 'realm_transfer',
};

const successClass = '';
const negativeClass = '';

export function genMilitaryRealmEvent(event, user?: boolean) {
  switch (event.eventType) {
    case Event.realmCombatAttack:
      return {
        event: (
          <div>
            <span className="">
              {event.data?.success
                ? `Raid successful on Realm ${event.data?.defendRealmId}`
                : `Raid failed on Realm ${event.data?.defendRealmId}`}
            </span>
          </div>
        ),
        class: event.data?.success ? successClass : negativeClass,
        resources: resourcePillaged(event.data?.pillagedResources),
        txHash: event.transactionHash,
        defendRealmId: event.data?.defendRealmId,
        relic: event.data?.relicClaimed ? (
          <span className="pl-10 text-xl font-semibold">
            Captured Relic {event.data?.relicClaimed}
          </span>
        ) : null,
        action: (
          <Button
            size="xs"
            variant="outline"
            href={'/realm/' + event.data?.defendRealmId + '?tab=Army'}
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
                ? `Defended raid from ${event.data?.attackRealmId}`
                : `We have been Pillaged by Realm ${event.data?.attackRealmId}`}
            </span>
          ),
          class: event.data?.success ? successClass : negativeClass,
          resources: resourcePillaged(event.data.pillagedResources),
          relic: event.data?.relicLost ? (
            <span className="pl-10 text-xl font-semibold uppercase">
              Relic {event.data?.relicLost}
            </span>
          ) : null,
          txHash: event.transactionHash,
          defendRealmId: event.realmId,
          action: (
            <Button
              size="xs"
              variant="outline"
              href={'/realm/' + event.data?.attackRealmId + '?tab=Army'}
            >
              {event.data?.success ? 'Try again' : 'muster the troops!'}
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
          relic: event.data?.relicLost ? (
            <span className="pl-10 text-xl font-semibold uppercase">
              Relic {event.data?.relicLost}
            </span>
          ) : null,
          txHash: event.transactionHash,
          defendRealmId: event.realmId,
          action: (
            <Button
              size="xs"
              variant="outline"
              href={'/realm/' + event.data?.attackRealmId + '?tab=Army'}
            >
              {event.data?.success ? 'Retaliate' : 'muster the troops!'}
            </Button>
          ),
        };
      }
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
    // case 'realm_mint':
    //   return {
    //     event: `Minted Realm ${event.realmId}`,
    //     class: successClass,
    //     action: (
    //       <Button
    //         size="xs"
    //         variant="outline"
    //         href={'/realm/' + event.realmId + '?tab=Survey'}
    //       >
    //         Manage Realm
    //       </Button>
    //     ),
    //   };
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
