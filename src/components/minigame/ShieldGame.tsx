import React, { useEffect, useState } from "react";
import BN from "bn.js";
import { ElementToken } from "~/constants";
import {
  ELEMENTS_ADDRESS,
  GameContext,
  getGameContextVariables,
  getTokenIdsForGame,
} from "~/util/minigameApi";
import Button from "~/shared/Button";
import ElementLabel from "~/shared/ElementsLabel";
import { getStarknet } from "@argent/get-starknet/dist";
import { defaultProvider, number, stark } from "starknet";
import BridgeModal from "../bridge/Modal";
import { useModuleAddress } from "~/hooks/useModuleAddress";
import { useStarknet, waitForTransaction } from "~/hooks/useStarknet";
import Castle from "./Castle";
import { toBN } from "starknet/dist/utils/number";
import GameBlockTimer from "./GameBlockTimer";
import AddressIndicator from "~/shared/AddressIndicator";
import classNames from "classnames";
import { getSelectorFromName } from "starknet/dist/utils/stark";

type Prop = {};

const ShieldGame: React.FC<Prop> = (props) => {
  const starknet = useStarknet();

  const [mintModalOpen, setMintModalOpen] = useState(false);

  const [actionAmount, setActionAmount] = useState<string>("1");
  const [action, setAction] = useState<"shield" | "attack">();

  // Contract state
  const [gameIdx, setGameIdx] = useState<string>();
  const [mainHealth, setMainHealth] = useState<BN>();
  const [_startBlockNum, setStartBlockNum] = useState<BN>();
  const [shieldValue, _setShieldValue] = useState<
    Record<ElementToken, string> | undefined
  >();

  const [tokenBalances, setTokenBalances] = useState<string[]>();

  const [gameCtx, setGameCtx] = useState<GameContext>();

  const [boost, setBoost] = useState<number>();

  const towerDefenceContractAddress = useModuleAddress("1");

  const fetchState = async () => {
    const gameCtx = await getGameContextVariables();

    setGameIdx(gameCtx.gameIdx);
    setMainHealth(toBN(gameCtx.mainHealth));
    setStartBlockNum(gameCtx.gameStartBlock);
    setBoost(gameCtx.currentBoost);
    setGameCtx(gameCtx);
  };

  const fetchTokenBalances = async (gameCtx: GameContext) => {
    // The token IDs change every game
    const tokenIds = getTokenIdsForGame(parseInt(gameCtx.gameIdx));

    const ownerAddress = starknet.address;

    if (ownerAddress) {
      const balances = await defaultProvider.callContract({
        contract_address: ELEMENTS_ADDRESS,
        entry_point_selector: getSelectorFromName("balance_of_batch"),
        calldata: [
          "2", // Owners length
          ownerAddress, // Owner address
          ownerAddress, // ... again
          "2", // Token IDs length
          ...tokenIds.map((tid) => tid.toString()), // Token IDs
        ],
      });

      // Discard the length which is the first value
      balances.result.shift();
      setTokenBalances(balances.result);
    }
  };

  // Fetch state on mount
  useEffect(() => {
    fetchState();
  }, []);

  // Refetch token balances whenever starknet address changes
  useEffect(() => {
    if (gameCtx) {
      fetchTokenBalances(gameCtx);
    }
  }, [starknet.address]);

  // TODO: Determine role and calculate token index by game idx offset
  const shieldingTokenId = 1;
  const attackingTokenId = 1;

  const tokenId: number = shieldingTokenId;

  const handleAttack = async (amount: number) => {
    await getStarknet().enable();
    const res = await getStarknet().signer?.invokeFunction(
      towerDefenceContractAddress as string,
      stark.getSelectorFromName("attack_tower"),
      [gameIdx as string, tokenId.toString(), (amount * 100).toString()]
    );

    await waitForTransaction(res?.transaction_hash as string);
    console.log("attack transaction finished");
    await fetchState();
  };

  const handleShield = async (amount: number) => {
    await getStarknet().enable();
    const res = await getStarknet().signer?.invokeFunction(
      towerDefenceContractAddress as string,
      stark.getSelectorFromName("increase_shield"),
      [
        gameIdx as string,
        tokenId.toString(),
        // The boost is automatically processed contract-side
        (amount * 100).toString(),
      ]
    );
    await waitForTransaction(res?.transaction_hash as string);
    console.log("shield transaction finished");
    await fetchState();
  };

  const gameIsActive =
    gameCtx &&
    gameCtx.currentBlock.toNumber() <
      gameCtx.gameStartBlock.toNumber() +
        gameCtx.blocksPerMinute * gameCtx.hoursPerGame;

  return (
    <div>
      <BridgeModal
        isOpen={mintModalOpen}
        toggle={() => setMintModalOpen(false)}
      />
      <h3 className="flex justify-between">
        <span className="text-2xl">
          Desiege <span className="text-sm"> game #</span>
          {gameIdx ? toBN(gameIdx).toNumber() : null}
          {gameCtx ? (
            <span
              className={classNames(
                "text-sm text-gray-500 p-1 rounded-sm ml-4 font-semibold",
                gameIsActive ? "bg-green-200" : "bg-red-200"
              )}
            >
              {gameIsActive
                ? mainHealth?.lte(toBN(0))
                  ? "COMPLETE"
                  : "ACTIVE"
                : "EXPIRED"}
            </span>
          ) : null}
        </span>
        <AddressIndicator />
      </h3>
      <div>
        {gameCtx ? (
          <>
            <GameBlockTimer gameCtx={gameCtx} />
          </>
        ) : null}
      </div>
      <div className="flex flex-row justify-between mx-60">
        <div id="game-actions" className="p-8 bg-gray-900 rounded-2xl">
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
                      ? tokenBalances[0]
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
                    ? tokenBalances[1]
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
              {boost && !isNaN(boost) ? (
                <div className="w-32 p-1 font-semibold text-white bg-blue-900 rounded-md">
                  {`+ ${boost / 100}% boost`}
                </div>
              ) : null}
            </div>
          </div>
          <br />
          <Button
            color={"primary"}
            disabled={action == undefined || actionAmount.length == 0}
            className="w-full mt-2 text-2xl text-white"
            onClick={() => {
              if (action == "shield") {
                handleShield(parseInt(actionAmount));
              } else if (action == "attack") {
                handleAttack(parseInt(actionAmount));
              }
            }}
          >
            Confirm Transaction
          </Button>
        </div>
        <div id="fortress-container">
          <p className="text-4xl">Fortress</p>
          <p className="text-2xl">
            Vitality: {mainHealth?.div(toBN(100)).toNumber().toFixed(2)}
          </p>
          <p>
            Dark Shield Value:{" "}
            {shieldValue ? shieldValue[ElementToken.Dark].toString() : "-"}
          </p>
          <p>
            Light Shield Value:{" "}
            {shieldValue ? shieldValue[ElementToken.Light].toString() : "-"}
          </p>
          {mainHealth ? <Castle health={mainHealth.toNumber()} /> : null}
        </div>
      </div>
    </div>
  );
};
export default ShieldGame;
