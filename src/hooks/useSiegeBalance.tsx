import { useEffect, useState } from "react";
import { getStarknet } from "@argent/get-starknet";
import BN from "bn.js";
import { useStarknet } from "~/hooks/useStarknet";
import { defaultProvider, number, stark } from "starknet";

import {
  getTokenIdsForGame,
  ELEMENTS_ADDRESS,
  TOKEN_INDEX_OFFSET_BASE,
  getIsApprovedForAll,
} from "~/util/minigameApi";

const { getSelectorFromName } = stark;

export const useSiegeBalance = () => {
  const starknet = useStarknet();
  const [tokenBalances, setTokenBalances] = useState<BN[]>();
  const [side, setSide] = useState<"light" | "dark">();

  const fetchTokenBalances = async (gameIdx: number) => {
    // The token IDs change every game
    const tokenIds = getTokenIdsForGame(gameIdx);

    const ownerAddress = starknet.address;

    if (ownerAddress) {
      const balances = await defaultProvider.callContract({
        contract_address: ELEMENTS_ADDRESS,
        entry_point_selector: getSelectorFromName("balance_of_batch"),
        calldata: [
          "2", // Owners length
          number.toBN(ownerAddress).toString(), // Owner address as an int
          number.toBN(ownerAddress).toString(), // ... again
          "2", // Token IDs length
          ...tokenIds.map((tid) => tid.toString()), // Token IDs
        ],
      });
      console.log(balances)
      // Discard the length which is the first value
      balances.result.shift();

      const balancesBN = balances.result.map((bs) => number.toBN(bs));

      if (balancesBN.length == 2) {
        const first = balancesBN[0];
        const second = balancesBN[1];

        if (first.gt(second)) {
          setSide("light");
        } else if (second.gt(first)) {
          setSide("dark");
        }
      }

      setTokenBalances(balancesBN);
    }
  };
  // Refetch token balances whenever starknet address changes
  // Memoize to avoid unnecessary re-renders for same value





  return {
    tokenBalances,
    fetchTokenBalances,
  };
};
