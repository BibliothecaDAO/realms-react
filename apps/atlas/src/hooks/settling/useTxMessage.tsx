import { Call, RawCalldata } from 'starknet';
import { Entrypoints } from './useResources';

type TxWithMetadata = { status: string; metadata?: any };

export function useTxMessage(tx: TxWithMetadata) {
  const isQueued = tx.status == 'ENQUEUED';

  const metadata = tx.metadata;

  if (metadata?.action) {
    switch (metadata.action) {
      case 'mint':
        return ['Minting', `Terraforming realm ${metadata.realmId}.`];

      case 'settle':
        return ['Settling', `Realm #${metadata.realmId} is being populated.`];

      case 'unsettle':
        return ['Unsettling', `Abandoning realm #${metadata.realmId}.`];

      case Entrypoints.claim:
        return [
          `${isQueued ? 'Harvest' : 'Harvesting'} Resources`,
          `Serfs gathering resources on Realm #${tx.metadata.realmId}.`,
        ];

      case 'realm_building':
        return [
          'Constructing Building',
          `Realm #${metadata.realmId} has commenced building ${metadata.buildingId}`,
        ];

      case 'upgrade_resource':
        return [
          'Upgrading Resource',
          `Realm ${metadata.realmId} is increasing production of ${metadata.resourceId}.`,
        ];

      case 'build_troops':
        return [
          `Building Troops`,
          `Realm #${metadata.realmId} is summoning an army.`,
        ];
      case 'raid':
        return [
          `Raiding Realm #${metadata.defendingRealmId}`,
          `Realm #${metadata.realmId} has mobilised their army for an attack.`,
        ];

      default:
        return ['No Title', 'No Message'];
    }
  } else {
    return ['No Title', 'No Message'];
  }
}
