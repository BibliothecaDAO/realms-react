import { useStarknetExecute, useStarknetInvoke } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { InvokeFunctionResponse } from 'starknet';
import { number, uint256 } from 'starknet';
import { useCommandList } from '@/context/CommandListContext';
import type { Bastion } from '@/generated/graphql';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
// import type { Bastion } from 'mockup/bastionsData';
import { soundSelector, useUiSounds } from '../useUiSounds';
import { ModuleAddr, useBastionsContract } from './stark-contracts';

export const Assets = {
  realms: 3,
  bastions: 17,
};

// entrypoints
export const Entrypoints = {
  bastionAttack: 'bastion_attack',
  bastionTakeLocation: 'bastion_take_location',
  bastionMove: 'bastion_move',
  travel: 'travel',
};

// transactions
export const createCall: Record<string, (args: any) => CallAndMetadata> = {
  bastionAttack: (args: {
    coordinates: { longitude: number; latitude: number };
    attacking_realm_id: number;
    attacking_army_id: number;
    defending_realm_id: number;
    defending_army_id: number;
  }) => ({
    contractAddress: ModuleAddr.Bastions,
    entrypoint: Entrypoints.bastionAttack,
    calldata: [
      args.coordinates.longitude,
      args.coordinates.latitude,
      ...uint256ToRawCalldata(uint256.bnToUint256(args.attacking_realm_id)),
      args.attacking_army_id,
      ...uint256ToRawCalldata(uint256.bnToUint256(args.defending_realm_id)),
      args.defending_army_id,
    ],
    metadata: {
      ...args,
      action: Entrypoints.bastionAttack,
    },
  }),
  bastionMove: (args: {
    coordinates: { longitude: number; latitude: number };
    next_location: number;
    realm_id: number;
    army_id: number;
  }) => ({
    contractAddress: ModuleAddr.Bastions,
    entrypoint: Entrypoints.bastionMove,
    calldata: [
      args.coordinates.longitude,
      args.coordinates.latitude,
      args.next_location,
      ...uint256ToRawCalldata(uint256.bnToUint256(args.realm_id)),
      args.army_id,
    ],
    metadata: {
      ...args,
      action: Entrypoints.bastionMove,
    },
  }),
  bastionTakeLocation: (args: {
    coordinates: { longitude: number; latitude: number };
    location: number;
    realm_id: number;
    army_id: number;
  }) => ({
    contractAddress: ModuleAddr.Bastions,
    entrypoint: Entrypoints.bastionTakeLocation,
    calldata: [
      args.coordinates.longitude,
      args.coordinates.latitude,
      args.location,
      ...uint256ToRawCalldata(uint256.bnToUint256(args.realm_id)),
      args.army_id,
    ],
    metadata: {
      ...args,
      action: Entrypoints.bastionTakeLocation,
    },
  }),
  travelToBastion: (args: {
    armyId: number;
    travellerId: number;
    destinationId: number;
  }) => ({
    contractAddress: ModuleAddr.Travel,
    entrypoint: Entrypoints.travel,
    calldata: [
      Assets.realms,
      ...uint256ToRawCalldata(uint256.bnToUint256(args.travellerId)),
      args.armyId,
      Assets.bastions,
      // ...uint256ToRawCalldata(uint256.bnToUint256(args.destinationId)),
      // TODOBASTIONS: remove that
      ...uint256ToRawCalldata(uint256.bnToUint256(3711000)),
      0, // nested destination is always 0 for now.
    ],
    metadata: {
      ...args,
      action: Entrypoints.travel,
    },
  }),
};

// renderTransaction for the shopping cart
export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.bastionAttack]: (tx, _context) => ({
    title: `Attack army on Bastion`,
    description: `Attack army ${tx.metadata.defending_army_id} of Realm ${tx.metadata.defending_realm_id} with army ${tx.metadata.attacking_army_id} of your Realm ${tx.metadata.attacking_realm_id}`,
  }),
  [Entrypoints.bastionMove]: (tx, _context) => ({
    title: `Move army on Bastion`,
    description: `Move army ${tx.metadata.army_id} of Realm ${tx.metadata.realm_id} to location ${tx.metadata.next_location} on Bastion`,
  }),
  [Entrypoints.bastionTakeLocation]: (tx, _context) => ({
    title: `Take location on Bastion`,
    description: `Take location ${tx.metadata.location} on Bastion with army ${tx.metadata.army_id} of Realm ${tx.metadata.realm_id}`,
  }),
};

export type Bastions = {
  bastionAttack: (args: {
    coordinates: { longitude: number; latitude: number };
    attacking_realm_id: number;
    attacking_army_id: number;
    defending_realm_id: number;
    defending_army_id: number;
  }) => void;
  bastionMove: (args: {
    coordinates: { longitude: number; latitude: number };
    next_location: number;
    realm_id: number;
    army_id: number;
  }) => void;
  bastionTakeLocation: (args: {
    coordinates: { longitude: number; latitude: number };
    location: number;
    realm_id: number;
    army_id: number;
  }) => void;
  travelToBastion: (args: {
    armyId: number;
    travellerId: number;
    destinationId: number;
  }) => void;
  selectedLocation: Location;
  setSelectedLocation: Dispatch<SetStateAction<Location>>;
  bastion: Bastion | undefined;
  setBastion: Dispatch<SetStateAction<Bastion | undefined>>;
  bastionAttackData: InvokeFunctionResponse | undefined;
  bastionAttackLoading: boolean;
  bastionAttackError: unknown;
};

export type Location = {
  locationId: number;
  defender: boolean;
};

export const useBastions = (): Bastions => {
  const { play: playBastionAttack } = useUiSounds(soundSelector.raid);
  const { play: playBastionTakeLocation } = useUiSounds(
    soundSelector.buildCastle
  );
  const { play: playBastionMove } = useUiSounds(soundSelector.summonTroops);
  const { play: playFly } = useUiSounds(soundSelector.fly);

  const { contract } = useBastionsContract();

  const [selectedLocation, setSelectedLocation] = useState<Location>({
    locationId: 5,
    defender: true,
  });

  const {
    data: bastionAttackData,
    error: bastionAttackError,
    loading: bastionAttackLoading,
    invoke: bastionAttackInvoke,
  } = useStarknetInvoke({
    contract: contract,
    method: Entrypoints.bastionAttack,
  });

  const [bastion, setBastion] = useState<Bastion | undefined>();

  const txQueue = useCommandList();

  return {
    bastionAttack: (args: {
      coordinates: { longitude: number; latitude: number };
      attacking_realm_id: number;
      attacking_army_id: number;
      defending_realm_id: number;
      defending_army_id: number;
    }) => {
      playBastionAttack();
      bastionAttackInvoke({
        args: [
          [args.coordinates.longitude, args.coordinates.latitude],
          uint256.bnToUint256(number.toBN(args.attacking_realm_id)),
          args.attacking_army_id,
          uint256.bnToUint256(number.toBN(args.defending_realm_id)),
          args.defending_army_id,
        ],
        metadata: {
          action: Entrypoints.bastionAttack,
          ...args,
        },
      });
    },
    bastionMove: (args: {
      coordinates: { longitude: number; latitude: number };
      next_location: number;
      realm_id: number;
      army_id: number;
    }) => {
      playBastionMove();
      txQueue.add(createCall.bastionMove(args));
    },
    bastionTakeLocation: (args: {
      coordinates: { longitude: number; latitude: number };
      location: number;
      realm_id: number;
      army_id: number;
    }) => {
      playBastionTakeLocation();
      txQueue.add(createCall.bastionTakeLocation(args));
    },
    travelToBastion: (args: {
      armyId: number;
      travellerId: number;
      destinationId: number;
    }) => {
      playFly();
      txQueue.add(createCall.travelToBastion(args));
    },
    selectedLocation,
    setSelectedLocation,
    bastion,
    setBastion,
    bastionAttackData,
    bastionAttackLoading,
    bastionAttackError,
  };
};
