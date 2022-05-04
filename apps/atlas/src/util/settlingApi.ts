/* eslint-disable @typescript-eslint/naming-convention */
import type BN from 'bn.js';
import { number, Provider } from 'starknet';
import { ElementToken } from '../constants';
import type { GameStatus } from '../types';
const { toBN } = number;

// Contract calculates effects in BIPS
// so this factor is used to normalize action amounts
export const EFFECT_BASE_FACTOR = 100;

export const CONTROLLER_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS as string) ||
  '0x29317ae2fccbb5ce0588454b8d13cf690fd7318a983cf72f0c9bf5f02f4a465';

export const starknetNetwork =
  (process.env.NEXT_PUBLIC_DESIEGE_STARKNET_NETWORK as
    | 'mainnet-alpha'
    | 'goerli-alpha') || 'goerli-alpha';

export const provider = new Provider({ network: starknetNetwork });

if (!CONTROLLER_ADDRESS) {
  throw new Error(
    'No controller address set. Please set NEXT_PUBLIC_CONTROLLER_ADDRESS in a .env file'
  );
}

const moduleAddressCache: Record<string, string> = {};

export const getModuleAddress: (moduleId: string) => Promise<string> = async (
  moduleId
) => {
  if (moduleAddressCache[moduleId]) {
    return Promise.resolve(moduleAddressCache[moduleId]);
  }

  const res = await provider.callContract({
    contractAddress: CONTROLLER_ADDRESS,
    entrypoint: 'get_module_address',
    calldata: [moduleId.toString()],
  });
  const [moduleAddress] = res.result;
  return moduleAddress;
};

export {};
