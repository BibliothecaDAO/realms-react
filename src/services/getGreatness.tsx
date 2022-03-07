import { ethers } from "ethers";
const { BigNumber } = require("@ethersproject/bignumber");
const { id, address } = require("@ethersproject/hash");

let items: any = {};

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
  let meta: any = {
    items: {},
    scores: {
      greatness: 0,
    },
    greatness: {},
  };
  for (let keyPrefix in items) {
    // not really sure what needs to happen if it's an address
    let tokenId = BigNumber.from(token).toString();

    const rand = random(keyPrefix + tokenId);
    const greatness = rand.mod(21);
    meta.scores.greatness += greatness.toNumber();
    meta.greatness[keyPrefix.toLowerCase()] = greatness.toNumber();
  }
  return meta;
};

function memoizer(fun: any) {
  let cache: any = {};

  return function (n: any) {
    if (cache[n] != undefined) {
      return cache[n];
    } else {
      let result = fun(n);
      cache[n] = result;

      return result;
    }
  };
}

export default memoizer(getMetadata);
