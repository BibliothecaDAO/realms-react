import { useState } from "react";
import BN from "bn.js";
import { useStarknet } from "@starknet-react/core";
import { number, stark } from "starknet";

import { getTokenIdsForGame, ELEMENTS_ADDRESS } from "~/util/minigameApi";

const { getSelectorFromName } = stark;

export const useSiegeBalance = () => {
  const starknet = useStarknet();
  const [loading, setLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<BN[]>();
  const [side, setSide] = useState<"light" | "dark">();
  const [error, setError] = useState<string>();

  const fetchTokenBalances = async (gameIdx: number) => {
    // The token IDs change every game
    const tokenIds = getTokenIdsForGame(gameIdx);

    const ownerAddress = starknet.account;

    if (ownerAddress) {
      setLoading(true);
      const balances = await starknet.library.callContract({
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
      setLoading(false);
    }
  };

  return {
    loading,
    side,
    tokenBalances,
    error,
    fetchTokenBalances: (gameIdx: number) => {
      try {
        setError(undefined);
        return fetchTokenBalances(gameIdx);
      } catch (e) {
        setError("Error fetching token balance");
        console.error("Fetch token balances error: ", e);
      }
    },
  };
};
