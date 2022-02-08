import { useState, useEffect, useMemo } from "react";
import BN from "bn.js";
import { defaultProvider, number, stark } from "starknet";
import { getStarknet } from "@argent/get-starknet/dist";
import { useModuleAddress } from "~/hooks/useModuleAddress";
import { waitForTransaction } from "~/hooks/useStarknet";

import ElementLabel from "~/shared/ElementsLabel";
import Button from "~/shared/Button";
import { useStarknet } from "~/hooks/useStarknet";
import BridgeModal from "../bridge/Modal";
import { getTokenIdsForGame, ELEMENTS_ADDRESS } from "~/util/minigameApi";
import { GameStatus } from "~/types";
const { getSelectorFromName } = stark;

type Prop = {
  gameIdx?: number;
  currentBoostBips?: number;
  gameStatus: GameStatus;
};

const GameControls: React.FC<Prop> = (props) => {
  const { gameIdx, currentBoostBips, gameStatus } = props;

  const starknet = useStarknet();

  const [tokenBalances, setTokenBalances] = useState<BN[]>();

  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [actionAmount, setActionAmount] = useState<string>("1");
  const [action, setAction] = useState<"shield" | "attack">();

  const [side, setSide] = useState<"light" | "dark">();

  // TODO: Determine role and calculate token index by game idx offset
  const shieldingTokenId = 1;
  const attackingTokenId = 1;

  const tokenId: number = shieldingTokenId;

  const towerDefenceContractAddress = useModuleAddress("1");

  const handleAttack = async (gameIndex: number, amount: number) => {
    await getStarknet().enable();
    const res = await getStarknet().signer?.invokeFunction(
      towerDefenceContractAddress as string,
      stark.getSelectorFromName("attack_tower"),
      [gameIndex.toString(), tokenId.toString(), (amount * 100).toString()]
    );

    if (res?.transaction_hash) {
      await waitForTransaction(res?.transaction_hash as string);
      const status = await defaultProvider.getTransactionStatus(
        res?.transaction_hash
      );
      console.log("attack transaction");
      console.log(status);
      //   await fetchState();
    }
  };

  const handleShield = async (gameIndex: number, amount: number) => {
    await getStarknet().enable();
    const res = await getStarknet().signer?.invokeFunction(
      towerDefenceContractAddress as string,
      stark.getSelectorFromName("increase_shield"),
      [
        gameIndex.toString(),
        tokenId.toString(),
        // The boost is automatically processed contract-side
        (amount * 100).toString(),
      ]
    );
    await waitForTransaction(res?.transaction_hash as string);
    console.log("shield transaction finished");
    // await fetchState();
  };

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
  const memoL2Address = useMemo(() => starknet.address, [starknet.address]);

  useEffect(() => {
    if (starknet.address && gameIdx !== undefined) {
      if (gameStatus == "active") {
        // Fetch balances for current game
        fetchTokenBalances(gameIdx);
      } else {
        // Fetch & show balances for the upcoming game
        fetchTokenBalances(gameIdx + 1);
      }
    }
  }, [memoL2Address, gameIdx]);

  return (
    <div
      id="game-actions"
      className="w-1/3 p-10 backdrop-blur-md bg-white/30 text-black rounded-2xl"
    >
      <BridgeModal
        isOpen={mintModalOpen}
        toggle={() => setMintModalOpen(false)}
      />
      <div>
        <p className="uppercase text-xl">Season 1</p>
        <h1 >
          <ElementLabel> Divine Eclipse</ElementLabel>{" "}
        </h1>
      </div>

      {gameStatus == "expired" ? (
        <div>
          {side == undefined ? (
            <button
              onClick={() => {
                if (starknet.active && side == undefined) {
                  setMintModalOpen(true);
                } else {
                  starknet.connect();
                }
              }}
              className="w-full p-2 mt-4 text-lg text-white transition-colors backdrop-blur-lg bg-white/30 border border-white rounded-md hover:bg-white/100"
            >
              {/* Side only undefined when token balances are equal, including 0-0 (they havent minted yet) */}
              {starknet.active ? (
                <>
                  <ElementLabel>Choose your  Elements</ElementLabel>
                </>
              ) : (
                "Connect StarkNet"
              )}
            </button>
          ) : null}

          <p className="mt-8 text-3xl">
            {side == "light" && tokenBalances ? (
              <>
                <ElementLabel side="light">LIGHT</ElementLabel>{" "}
                {(tokenBalances[0].toNumber() / 100).toFixed(0)}
              </>
            ) : null}
            {side == "dark" && tokenBalances ? (
              <>
                <ElementLabel side="dark">DARK</ElementLabel>{" "}
                {(tokenBalances[1].toNumber() / 100).toFixed(0)}
              </>
            ) : null}
          </p>
          <p className="my-4 text-xl animate-pulse">
            Waiting for next game to start...
          </p>
          <p className="font-bold">Preparation for Desiege</p>
          <ul className="list-none text-xl">
            <li>
              Read the <a className="underline">game guide</a>
            </li>
            <li>
              Coordinate on <a className="underline"> Discord</a>
            </li>
            <li>
              <a className="underline">Recruit</a> your friends
            </li>
            <li>
              Explore the open-source <a className="underline">front-end</a> and{" "}
              <a className="underline">StarkNet</a> contracts
            </li>
          </ul>
        </div>
      ) : (
        <>
          <div className="flex w-full gap-4 mt-4 text-gray-100 row">
            <div className="flex-1">
              <p>
                LIGHT{" "}
                <ElementLabel side="light">
                  {tokenBalances && tokenBalances.length > 0
                    ? number.toBN(tokenBalances[0]).toString()
                    : null}
                </ElementLabel>
              </p>

              <Button
                className="w-full mt-4"
                active={action == "shield"}
                onClick={() => setAction("shield")}
              >
                Shield
              </Button>
            </div>
            <div className="flex-1">
              DARK{" "}
              <ElementLabel side="dark">
                {tokenBalances && tokenBalances.length > 1
                  ? number.toBN(tokenBalances[1]).toString()
                  : null}
              </ElementLabel>
              <Button
                className="w-full mt-4"
                active={action == "attack"}
                onClick={() => setAction("attack")}
              >
                Attack
              </Button>
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <input
              autoFocus
              type="number"
              placeholder="Amount"
              min={0}
              value={actionAmount}
              onChange={(e) => {
                if (parseInt(e.target.value)) {
                  setActionAmount(e.target.value);
                } else {
                  setActionAmount("");
                }
              }}
              className="w-40 px-6 py-4 text-4xl bg-gray-200 border-2 rounded-md"
            />{" "}
            <div className="ml-4">
              {currentBoostBips && !isNaN(currentBoostBips) ? (
                <div className="w-32 p-1 font-semibold text-white bg-blue-900 rounded-md">
                  {`+ ${currentBoostBips / 100}% boost`}
                </div>
              ) : null}
            </div>
          </div>
          {starknet.active ? (
            <Button
              color={"primary"}
              disabled={action == undefined || actionAmount.length == 0}
              className="w-full mt-2 text-2xl text-white"
              onClick={() => {
                if (gameIdx) {
                  if (action == "shield") {
                    handleShield(gameIdx, parseInt(actionAmount));
                  } else if (action == "attack") {
                    handleAttack(gameIdx, parseInt(actionAmount));
                  }
                }
              }}
            >
              Confirm Transaction
            </Button>
          ) : (
            <Button
              className="w-full"
              color="default"
              onClick={() => starknet.connect()}
            >
              Connect StarkNet
            </Button>
          )}
        </>
      )}
    </div>
  );
};
export default GameControls;
