import type { uint256 } from 'starknet';

export function uint256ToRawCalldata(num: uint256.Uint256) {
  return [num.high, num.low];
}
