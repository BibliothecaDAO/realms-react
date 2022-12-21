import Image from 'next/image';
import { useEffect } from 'react';
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
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.create_labor]: (tx, ctx) => ({
    title: `${ctx.isQueued ? 'Build' : 'Building'} Tools & Labor`,
    description: (
      <span>
        <div className="flex my-1">
          <Image
            src={'/resources/' + tx.metadata.resourceId + '.jpg'}
            alt="map"
            width={80}
            height={80}
            className="border-4 rounded-2xl border-yellow-800/40"
          />
          <div className="self-center ml-4">
            <h3>
              Creating {tx.metadata.laborUnits} Tools & Labor on
              {getRealmNameById(tx.metadata.realmId)} for{' '}
              {findResourceById(tx.metadata.resourceId)?.trait}
            </h3>
          </div>
        </div>
      </span>
    ),
  }),
};

type Resources = {
  create: (args: { resourceId; laborUnits; costs }) => void;
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
    loading: false,
  };
};

export default useLabor;
