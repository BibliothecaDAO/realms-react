import Image from 'next/image';
import { number, uint256 } from 'starknet';
import { getRealmNameById } from '@/components/realms/RealmsGetters';
import { findResourceById } from '@/constants/resources';
import { useCommandList } from '@/context/CommandListContext';
import type { Realm } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';

export const Entrypoints = {
  create_labor: 'create',
  harvest_labor: 'harvest',
};

const EntrypointKeys = {
  [Entrypoints.harvest_labor]: 'harvest_labor',
  [Entrypoints.create_labor]: 'create_labor',
};

export const createCall: Record<string, (args: any) => CallAndMetadata> = {
  create: (args: { realmId; resourceId; laborUnits; costs }) => ({
    contractAddress: ModuleAddr.Labor,
    entrypoint: Entrypoints.create_labor,
    calldata: [
      ...uint256ToRawCalldata(uint256.bnToUint256(number.toBN(args.realmId))),
      ...uint256ToRawCalldata(
        uint256.bnToUint256(number.toBN(args.resourceId))
      ),
      args.laborUnits,
    ],
    metadata: { ...args, action: EntrypointKeys.create_labor },
  }),
  harvest: (args: { realmId; resourceId }) => ({
    contractAddress: ModuleAddr.Labor,
    entrypoint: Entrypoints.harvest_labor,
    calldata: [
      ...uint256ToRawCalldata(uint256.bnToUint256(number.toBN(args.realmId))),
      ...uint256ToRawCalldata(
        uint256.bnToUint256(number.toBN(args.resourceId))
      ),
    ],
    metadata: { ...args, action: EntrypointKeys.harvest_labor },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [EntrypointKeys.create_labor]: (tx, ctx) => ({
    title: `${ctx.isQueued ? 'Build' : 'Building'} Tools & Labor`,
    description: (
      <div className="flex my-1">
        <Image
          src={'/resources/' + tx.metadata.resourceId + '.jpg'}
          alt="map"
          width={80}
          height={80}
          className="border-4 rounded-2xl border-yellow-800/40"
        />
        <div className="self-center ml-4 text-md">
          Creating {tx.metadata.laborUnits} Tools & Labor on{' '}
          {getRealmNameById(tx.metadata.realmId)} for{' '}
          {findResourceById(tx.metadata.resourceId)?.trait}
        </div>
      </div>
    ),
  }),
  [EntrypointKeys.harvest_labor]: (tx, ctx) => ({
    title: `${ctx.isQueued ? 'Harvest' : 'Harvesting'} ${
      findResourceById(tx.metadata.resourceId)?.trait
    }`,
    description: (
      <div className="flex my-1">
        <Image
          src={'/resources/' + tx.metadata.resourceId + '.jpg'}
          alt="map"
          width={80}
          height={80}
          className="border-4 rounded-2xl border-yellow-800/40"
        />
        <div className="self-center ml-4 text-md">
          Harvesting {tx.metadata.laborUnits} Tools & Labor on{' '}
          {getRealmNameById(tx.metadata.realmId)} for{' '}
          {findResourceById(tx.metadata.resourceId)?.trait}
        </div>
      </div>
    ),
  }),
};

type Resources = {
  create: (args: { resourceId; laborUnits; costs }) => void;
  harvest: (args: { resourceId }) => void;
  loading: boolean;
};

const useLabor = (realm: Realm): Resources => {
  const { play } = useUiSounds(soundSelector.claim);

  const txQueue = useCommandList();

  return {
    create: (args: { resourceId; laborUnits; costs }) => {
      console.log(args.costs);
      const qtyCosts = args.costs.map((a) => {
        return {
          resourceId: a.resourceId,
          amount: (a.amount * args.laborUnits) / 12,
          resourceName: a.resourceName,
        };
      });

      play();
      txQueue.add(
        createCall.create({
          realmId: realm?.realmId,
          resourceId: args.resourceId,
          laborUnits: args.laborUnits,
          costs: { amount: 0, resources: qtyCosts },
        })
      );
    },
    harvest: (args: { resourceId }) => {
      play();
      txQueue.add(
        createCall.harvest({
          realmId: realm?.realmId,
          resourceId: args.resourceId,
        })
      );
    },
    loading: false,
  };
};

export default useLabor;
