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

const starknetNetwork = process.env.NEXT_PUBLIC_DESIEGE_STARKNET_NETWORK as
  | 'mainnet-alpha'
  | 'goerli-alpha';

export const provider = new Provider({ network: starknetNetwork });

if (!CONTROLLER_ADDRESS) {
  throw new Error(
    'No controller address set. Please set NEXT_PUBLIC_CONTROLLER_ADDRESS in a .env file'
  );
}

export const ELEMENTS_ADDRESS =
  (process.env.NEXT_PUBLIC_MINIGAME_ELEMENTS_ADDRESS as string) ||
  '0x2d069c47466965b3af9c590d026eb34d4dede0ba64c511ad8945bf13d228429';

export const TOKEN_INDEX_OFFSET_BASE = 10;

// The minimum amount of tokens to mint
export const MINIMUM_MINT_AMOUNT = 100;

export enum ShieldGameRole {
  Shielder = '0',
  Attacker = '1',
}

export enum GameStatusEnum {
  Active = 0,
  Expired = 1,
}

export enum SelectorName {
  getLatestGameIndex = 'get_latest_game_index',
  getMainHealth = 'get_main_health',
  getShieldValue = 'get_shield_value',
  getGameContextVariables = 'get_game_context_variables',
}

export const getLatestGameIndex: () => Promise<string> = async () => {
  const tdStorageAddress = await getModuleAddress('2');

  // Get latest game index
  const res = await provider.callContract({
    contractAddress: tdStorageAddress,
    entrypoint: SelectorName.getLatestGameIndex,
  });
  const [latestIndex] = res.result;

  if (number.isHex(latestIndex)) {
    return number.hexToDecimalString(latestIndex);
  }

  return latestIndex;
};

type GamePromise<T> = (gameIndex: string) => Promise<T>;

export const getMainHealth: GamePromise<BN> = async (gameIndex) => {
  const tdStorageAddress = await getModuleAddress('2');

  const res = await provider.callContract({
    contractAddress: tdStorageAddress,
    entrypoint: SelectorName.getMainHealth,
    calldata: [gameIndex],
  });
  const [mainHealth] = res.result;
  return number.toBN(mainHealth);
};

export const getGameStatus: GamePromise<GameStatus> = async (gameIndex) => {
  const tdAddress = await getModuleAddress('1');

  const res = await provider.callContract({
    contractAddress: tdAddress,
    entrypoint: 'get_game_state',
    calldata: [gameIndex],
  });

  const [state] = res.result;
  return state == '0x0' ? 'active' : 'expired';
};

export const getShieldValue: (
  gameIndex: string,
  tokenId: number
) => Promise<BN> = async (gameIndex, tokenId) => {
  const tdStorageAddress = await getModuleAddress('2');

  const res = await provider.callContract({
    contractAddress: tdStorageAddress,
    entrypoint: SelectorName.getShieldValue,
    calldata: [gameIndex, tokenId.toString()],
  });
  const [shieldValue] = res.result;
  return number.toBN(shieldValue);
};

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

export const getTotalRewardAlloc: (
  gameIdx: string,
  side: ShieldGameRole
) => Promise<BN> = async (gameIdx, side) => {
  const tdStorageAddress = await getModuleAddress('2');

  const res = await provider.callContract({
    contractAddress: tdStorageAddress,
    entrypoint: 'get_total_reward_alloc',
    calldata: [gameIdx, side],
  });
  const [totalReward] = res.result;
  return number.toBN(totalReward);
};

export const getUserRewardAlloc: (
  gameIdx: string,
  user: string,
  gameRole: ShieldGameRole
) => Promise<BN> = async (gameIdx, user, gameRole) => {
  const tdStorageAddress = await getModuleAddress('2');

  const res = await provider.callContract({
    contractAddress: tdStorageAddress,
    entrypoint: 'get_user_reward_alloc',
    calldata: [gameIdx, user, gameRole],
  });
  const [userReward] = res.result;
  return number.toBN(userReward);
};

export const getTokenRewardPool: (
  gameIdx: string,
  tokenId: number
) => Promise<BN> = async (gameIdx, tokenId) => {
  const tdStorageAddress = await getModuleAddress('2');

  const res = await provider.callContract({
    contractAddress: tdStorageAddress,
    entrypoint: 'get_token_reward_pool',
    calldata: [gameIdx, tokenId.toString()],
  });
  const [tokenReward] = res.result;
  return number.toBN(tokenReward);
};

export type GameContext = {
  gameIdx: number;
  blocksPerMinute: number;
  hoursPerGame: number;
  currentBlock: BN;
  gameStartBlock: BN;
  mainHealth: BN;
  currentBoost: number; // in basis points
};

export const getGameContextVariables: () => Promise<GameContext> = async () => {
  const tdAddress = await getModuleAddress('1');
  const res = await provider.callContract({
    contractAddress: tdAddress,
    entrypoint: 'get_game_context_variables',
    calldata: [],
  });

  const varList = res.result;

  const ctx: GameContext = {
    gameIdx: toBN(varList[0]).toNumber(),
    blocksPerMinute: toBN(varList[1]).toNumber(),
    hoursPerGame: toBN(varList[2]).toNumber(),
    currentBlock: toBN(varList[3]),
    gameStartBlock: toBN(varList[4]),
    mainHealth: toBN(varList[5]),
    currentBoost: toBN(varList[6]).toNumber(),
  };

  return ctx;
};

export const getCurrentBoost: () => Promise<number> = async () => {
  const tdAddress = await getModuleAddress('1');
  const res = await provider.callContract({
    contractAddress: tdAddress,
    entrypoint: 'get_current_boost',
    calldata: [],
  });
  const [boostHex] = res.result;
  return toBN(boostHex).toNumber();
};

/*
  Convenience function for getting token IDs per game.
  Token IDs are deterministic based on the game index,
  they are offset from gameIdx X 10. They change each game,
  to prevent element hoarding, encourage usage and provide a
  fresh game state each time.
*/
export const getTokenIdsForGame = (gameIdx: number) => {
  // Having a multiplier of 10 means that there are max 10
  // "slots" for token IDs per game. This can be increased
  // in the future.
  const tokenOffset = TOKEN_INDEX_OFFSET_BASE * gameIdx;
  return [tokenOffset + 1, tokenOffset + 2];
};

export const getTotalElementsMinted = async (gameIdx: number) => {
  const elementBalancerModule = await getModuleAddress('4');

  const tokenOffset = TOKEN_INDEX_OFFSET_BASE * gameIdx;

  const mintedLight = await provider.callContract({
    contractAddress: elementBalancerModule,
    entrypoint: 'get_total_minted',
    calldata: [(tokenOffset + ElementToken.Light).toString()],
  });
  const mintedDark = await provider.callContract({
    contractAddress: elementBalancerModule,
    entrypoint: 'get_total_minted',
    calldata: [(tokenOffset + ElementToken.Dark).toString()],
  });

  const [light] = mintedLight.result;
  const [dark] = mintedDark.result;

  return {
    light: toBN(light).toNumber(),
    dark: toBN(dark).toNumber(),
  };
};

// To maintain balance next mint divides diff by 2
export const getNextMintAmount = ({
  light,
  dark,
}: {
  light: number;
  dark: number;
}) => {
  // The totals received will be
  const baseAmount = MINIMUM_MINT_AMOUNT * EFFECT_BASE_FACTOR;

  let diff;
  if (light > dark) {
    diff = light - dark;
  } else if (dark > light) {
    diff = dark - light;
  } else {
    return baseAmount;
  }

  const balancedNextAmount = Math.round(diff / 2);
  return Math.max(balancedNextAmount, baseAmount);
};

export const getIsApprovedForAll = async (
  account: string,
  operator: string
) => {
  const res = await provider.callContract({
    contractAddress: ELEMENTS_ADDRESS,
    entrypoint: 'isApprovedForAll',
    calldata: [toBN(account).toString(), toBN(operator).toString()],
  });
  const [isApproved] = res.result;
  return isApproved == '0x1';
};
