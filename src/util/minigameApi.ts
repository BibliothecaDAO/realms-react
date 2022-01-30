import BN from "bn.js";
import { defaultProvider, number, stark } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export const CONTROLLER_ADDRESS = process.env
  .NEXT_PUBLIC_CONTROLLER_ADDRESS as string;

const TOWER_DEFENCE_STORAGE_ADDRESS =
  "0x0511a73dad0e56422328063cb1b6660ab23bae28c1e956bd17a60c578b9a204b";

export enum ShieldGameRole {
  Shielder = "0",
  Attacker = "1",
}

export enum SelectorName {
  getLatestGameIndex = "get_latest_game_index",
  getMainHealth = "get_main_health",
  getShieldValue = "get_shield_value",
  getGameContextVariables = "get_game_context_variables",
}

export const getLatestGameIndex: () => Promise<string> = async () => {
  // Get latest game index
  const res = await defaultProvider.callContract({
    contract_address: TOWER_DEFENCE_STORAGE_ADDRESS,
    entry_point_selector: stark.getSelectorFromName(
      SelectorName.getLatestGameIndex
    ),
  });
  const [latestIndex] = res.result;

  if (number.isHex(latestIndex)) {
    return number.hexToDecimalString(latestIndex);
  }

  return latestIndex;
};

type GamePromise<T> = (gameIndex: string) => Promise<T>;

export const getMainHealth: GamePromise<BN> = async (gameIndex) => {
  const res = await defaultProvider.callContract({
    contract_address: TOWER_DEFENCE_STORAGE_ADDRESS,
    entry_point_selector: stark.getSelectorFromName(SelectorName.getMainHealth),
    calldata: [gameIndex],
  });
  const [mainHealth] = res.result;
  return number.toBN(mainHealth);
};

export const getShieldValue: (
  gameIndex: string,
  tokenId: number
) => Promise<BN> = async (gameIndex, tokenId) => {
  const res = await defaultProvider.callContract({
    contract_address: TOWER_DEFENCE_STORAGE_ADDRESS,
    entry_point_selector: stark.getSelectorFromName(
      SelectorName.getShieldValue
    ),
    calldata: [gameIndex, tokenId.toString()],
  });
  const [shieldValue] = res.result;
  return number.toBN(shieldValue);
};

let moduleAddressCache: Record<string, string> = {};

export const getModuleAddress: (moduleId: string) => Promise<string> = async (
  moduleId
) => {
  if (moduleAddressCache[moduleId]) {
    return Promise.resolve(moduleAddressCache[moduleId]);
  }

  const res = await defaultProvider.callContract({
    contract_address: CONTROLLER_ADDRESS,
    entry_point_selector: stark.getSelectorFromName("get_module_address"),
    calldata: [moduleId.toString()],
  });
  const [moduleAddress] = res.result;
  return moduleAddress;
};

export const getTotalRewardAlloc: (
  gameIdx: string,
  side: ShieldGameRole
) => Promise<BN> = async (gameIdx, side) => {
  const res = await defaultProvider.callContract({
    contract_address: TOWER_DEFENCE_STORAGE_ADDRESS,
    entry_point_selector: stark.getSelectorFromName("get_total_reward_alloc"),
    calldata: [gameIdx, side],
  });
  const [totalReward] = res.result;
  return number.toBN(totalReward);
};

export const getUserRewardAlloc: (
  gameIdx: string,
  user: string,
  side: ShieldGameRole
) => Promise<BN> = async (gameIdx, user, side) => {
  const res = await defaultProvider.callContract({
    contract_address: TOWER_DEFENCE_STORAGE_ADDRESS,
    entry_point_selector: stark.getSelectorFromName("get_user_reward_alloc"),
    calldata: [gameIdx, user, side],
  });
  const [userReward] = res.result;
  return number.toBN(userReward);
};

export const getTokenRewardPool: (
  gameIdx: string,
  tokenId: number
) => Promise<BN> = async (gameIdx, tokenId) => {
  const res = await defaultProvider.callContract({
    contract_address: TOWER_DEFENCE_STORAGE_ADDRESS,
    entry_point_selector: stark.getSelectorFromName("get_token_reward_pool"),
    calldata: [gameIdx, tokenId.toString()],
  });
  const [tokenReward] = res.result;
  return number.toBN(tokenReward);
};

export type GameContext = {
  gameIdx: string;
  blocksPerMinute: number;
  hoursPerGame: number;
  currentBlock: BN;
  gameStartBlock: BN;
  mainHealth: BN;
  currentBoost: number; // in basis points
};

export const getGameContextVariables: () => Promise<GameContext> = async () => {
  const res = await defaultProvider.callContract({
    contract_address: "",
    entry_point_selector: stark.getSelectorFromName(
      "get_game_context_variables"
    ),
    calldata: [],
  });

  const [varList] = res.result;

  const ctx: GameContext = {
    gameIdx: toBN(varList[0]).toString(),
    blocksPerMinute: toBN(varList[1]).toNumber(),
    hoursPerGame: toBN(varList[2]).toNumber(),
    currentBlock: toBN(varList[3]),
    gameStartBlock: toBN(varList[4]),
    mainHealth: toBN(varList[5]),
    currentBoost: toBN(varList[6]).toNumber(),
  };

  return ctx;
};
