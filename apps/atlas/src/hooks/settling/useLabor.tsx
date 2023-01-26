import Image from 'next/image';
import { number, uint256 } from 'starknet';
import { getRealmNameById } from '@/components/realms/RealmsGetters';
import { findResourceById, ResourcesIds } from '@/constants/resources';
import { useCommandList } from '@/context/CommandListContext';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';

export const Entrypoints = {
  create_labor: 'create',
  create_food: 'create_food',
  harvest_labor: 'harvest',
  harvest_food: 'harvest_food',
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
    metadata: { ...args, action: Entrypoints.create_labor },
  }),
  create_food: (args: {
    realmId;
    resourceId;
    laborUnits;
    qtyBuilt;
    costs;
  }) => ({
    contractAddress: ModuleAddr.Labor,
    entrypoint: Entrypoints.create_food,
    calldata: [
      ...uint256ToRawCalldata(uint256.bnToUint256(number.toBN(args.realmId))),
      ...uint256ToRawCalldata(
        uint256.bnToUint256(number.toBN(args.resourceId))
      ),
      args.laborUnits,
      args.qtyBuilt,
    ],
    metadata: { ...args, action: Entrypoints.create_food },
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
    metadata: { ...args, action: Entrypoints.harvest_labor },
  }),
  harvest_food: (args: { realmId; resourceId }) => ({
    contractAddress: ModuleAddr.Labor,
    entrypoint: Entrypoints.harvest_food,
    calldata: [
      ...uint256ToRawCalldata(uint256.bnToUint256(number.toBN(args.realmId))),
      ...uint256ToRawCalldata(
        uint256.bnToUint256(number.toBN(args.resourceId))
      ),
    ],
    metadata: { ...args, action: Entrypoints.harvest_food },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.create_labor]: (tx, ctx) => ({
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
          Building {tx.metadata.laborUnits}hrs of Tools & Labor on{' '}
          {getRealmNameById(tx.metadata.realmId)} for{' '}
          {findResourceById(tx.metadata.resourceId)?.trait}
        </div>
      </div>
    ),
  }),
  [Entrypoints.create_food]: (tx, ctx) => ({
    title: `${ctx.isQueued ? 'Build' : 'Building'} ${tx.metadata.qtyBuilt} ${
      tx.metadata.resourceId === ResourcesIds.Fish
        ? 'Fishing Villages'
        : 'Farms'
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
          Building {tx.metadata.laborUnits}hrs of Tools & Labor on{' '}
          {getRealmNameById(tx.metadata.realmId)} for{' '}
          {findResourceById(tx.metadata.resourceId)?.trait}
        </div>
      </div>
    ),
  }),
  [Entrypoints.harvest_labor]: (tx, ctx) => ({
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
          Harvesting {findResourceById(tx.metadata.resourceId)?.trait} on{' '}
          {getRealmNameById(tx.metadata.realmId)}
        </div>
      </div>
    ),
  }),
  [Entrypoints.harvest_food]: (tx, ctx) => ({
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
          Harvesting {findResourceById(tx.metadata.resourceId)?.trait} on{' '}
          {getRealmNameById(tx.metadata.realmId)}
        </div>
      </div>
    ),
  }),
};

type Resources = {
  create: (args: { realmId; resourceId; laborUnits; costs }) => void;
  create_food: (args: {
    realmId;
    resourceId;
    laborUnits;
    qtyBuilt;
    costs;
  }) => void;
  harvest: (args: { realmId; resourceId }) => void;
  harvest_food: (args: { realmId; resourceId }) => void;
  loading: boolean;
};

const useLabor = (): Resources => {
  const { play } = useUiSounds(soundSelector.claim);

  const txQueue = useCommandList();

  return {
    create: (args: { realmId; resourceId; laborUnits; costs }) => {
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
          realmId: args.realmId,
          resourceId: args.resourceId,
          laborUnits: args.laborUnits,
          costs: { amount: 0, resources: qtyCosts },
        })
      );
    },
    create_food: (args: {
      realmId;
      resourceId;
      laborUnits;
      qtyBuilt;
      costs;
    }) => {
      const qtyCosts = args.costs.map((a) => {
        return {
          resourceId: a.resourceId,
          amount: (a.amount * args.laborUnits) / 12,
          resourceName: a.resourceName,
        };
      });

      play();
      txQueue.add(
        createCall.create_food({
          realmId: args.realmId,
          resourceId: args.resourceId,
          laborUnits: args.laborUnits,
          qtyBuilt: args.qtyBuilt,
          costs: { amount: 0, resources: qtyCosts },
        })
      );
    },
    harvest: (args: { realmId; resourceId }) => {
      play();
      txQueue.add(
        createCall.harvest({
          realmId: args.realmId,
          resourceId: args.resourceId,
        })
      );
    },
    harvest_food: (args: { realmId; resourceId }) => {
      play();
      txQueue.add(
        createCall.harvest_food({
          realmId: args.realmId,
          resourceId: args.resourceId,
        })
      );
    },
    loading: false,
  };
};

export default useLabor;
