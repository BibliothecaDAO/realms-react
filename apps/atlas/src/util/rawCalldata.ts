import type { uint256 } from 'starknet';

export function uint256ToRawCalldata(num: uint256.Uint256) {
  return [num.low.toString(10), num.high.toString(10)];
}
