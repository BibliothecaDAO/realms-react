import { buildingIdToString } from '@/constants/buildings';
import { ENQUEUED_STATUS, Squad } from '@/constants/index';
import { Entrypoints as BuildingMethods } from './useBuildings';
import { Entrypoints as CombatMethods } from './useCombat';
import { Entrypoints as ResourceMethods } from './useResources';

type TxWithMetadata = { status: string; metadata?: any };

interface TxMessage {
  title: string;
  description: string;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function getTxMessage(tx: TxWithMetadata): TxMessage {
  const isQueued = tx.status == ENQUEUED_STATUS;

  const metadata = tx.metadata;

  if (metadata.title && metadata.description) {
    return metadata;
  }

  if (metadata?.action) {
    switch (metadata.action) {
      case 'mint':
        return {
          title: 'Minting',
          description: `Terraforming realm ${metadata.realmId}.`,
        };

      case 'settle':
        return {
          title: 'Settling',
          description: `Realm #${metadata.realmId} is being populated.`,
        };

      case 'unsettle':
        return {
          title: 'Unsettling',
          description: `Abandoning realm #${metadata.realmId}.`,
        };

      case ResourceMethods.claim:
        return {
          title: `${isQueued ? 'Harvest' : 'Harvesting'} Resources`,
          description: `Serfs gathering resources on Realm #${tx.metadata.realmId}.`,
        };

      case BuildingMethods.build:
        return {
          title: isQueued ? 'Construct Building' : 'Constructing Building',
          description: `Realm #${metadata.realmId} ${
            isQueued ? `commanded to build ` : 'has commenced building '
          } ${buildingIdToString(metadata.buildingId)}`,
        };

      case 'upgrade_resource':
        return {
          title: 'Upgrading Resource',
          description: `Realm ${metadata.realmId} is increasing production of ${metadata.resourceId}.`,
        };

      case CombatMethods.buildSquad:
        return {
          title: `Troop Training`,
          description: `Realm #${metadata.realmId} ${
            isQueued ? 'ordered to train' : 'is training'
          } ${metadata.troopIds.length} troops for ${
            Squad[metadata.squadSlot]
          }ing army.`,
        };
      case 'raid':
        return {
          title: `Raiding Realm #${metadata.defendingRealmId}`,
          description: `Realm #${metadata.realmId} has mobilised their army for an attack.`,
        };

      default:
        return { title: 'No Title', description: 'No Message' };
    }
  } else {
    return { title: 'No Title', description: 'No Message' };
  }
}
