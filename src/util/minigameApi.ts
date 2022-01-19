import BN from "bn.js";
import { defaultProvider, number, stark } from "starknet";

export const CONTROLLER_ADDRESS = process.env
  .NEXT_PUBLIC_CONTROLLER_ADDRESS as string;

const TOWER_DEFENCE_STORAGE_ADDRESS =
  "0x0511a73dad0e56422328063cb1b6660ab23bae28c1e956bd17a60c578b9a204b";

export enum SelectorName {
  getLatestGameIndex = "get_latest_game_index",
  getMainHealth = "get_main_health",
  getShieldValue = "get_shield_value",
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
