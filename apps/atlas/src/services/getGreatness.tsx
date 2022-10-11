/* eslint-disable @typescript-eslint/no-explicit-any */
import { id } from '@ethersproject/hash';
import { BigNumber } from 'ethers';

const items: any = {};

items.WEAPON = [];
items.CHEST = [];
items.HEAD = [];
items.WAIST = [];
items.FOOT = [];
items.HAND = [];
items.NECK = [];
items.RING = [];

const random = (input: string) => BigNumber.from(id(input));

const getMetadata = (token: string) => {
  const meta: any = {
    items: {},
    scores: {
      greatness: 0,
    },
    greatness: {},
  };
  for (const keyPrefix in items) {
    // not really sure what needs to happen if it's an address
    const tokenId = BigNumber.from(token).toString();

    const rand = random(keyPrefix + tokenId);
    const greatness = rand.mod(21);
    meta.scores.greatness += greatness.toNumber();
    meta.greatness[keyPrefix.toLowerCase()] = greatness.toNumber();
  }
  return meta;
};

function memoizer(fun: any) {
  const cache: any = {};

  return function (n: any) {
    if (cache[n] != undefined) {
      return cache[n];
    } else {
      const result = fun(n);
      cache[n] = result;

      return result;
    }
  };
}

export default memoizer(getMetadata);
