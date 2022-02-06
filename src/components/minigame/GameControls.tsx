import { useState, useEffect, useMemo } from "react";

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

  const [tokenBalances, setTokenBalances] = useState<string[]>();

  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [actionAmount, setActionAmount] = useState<string>("1");
  const [action, setAction] = useState<"shield" | "attack">();

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
      setTokenBalances(balances.result);
    }
  };
  // Refetch token balances whenever starknet address changes
  // Memoize to avoid unnecessary re-renders for same value
  const memoL2Address = useMemo(() => starknet.address, [starknet.address]);

  useEffect(() => {
    if (starknet.address && gameIdx) {
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
    <div id="game-actions" className="p-8 bg-gray-900 rounded-2xl">
      <BridgeModal
        isOpen={mintModalOpen}
        toggle={() => setMintModalOpen(false)}
      />
      <div className="text-3xl">
        <p className="flex justify-between mb-8">
          <ElementLabel>ELEMENTS</ElementLabel>{" "}
          <button
            onClick={() => setMintModalOpen(true)}
            className="p-2 text-sm text-white border border-white rounded-md hover:text-gray-200"
          >
            Mint Game Assets
          </button>
        </p>

        <div className="flex w-full gap-4 text-gray-100 row">
          <div className="flex-1">
            <p>
              LIGHT{" "}
              <ElementLabel>
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
            <ElementLabel>
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
      </div>

      <br />

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
      <br />
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
    </div>
  );
};
export default GameControls;
