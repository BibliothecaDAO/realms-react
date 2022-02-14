import { useState, useEffect, useMemo } from "react";
import BN from "bn.js";
import { defaultProvider, number, stark } from "starknet";
import { getStarknet } from "@argent/get-starknet/dist";
import { useModuleAddress } from "~/hooks/useModuleAddress";
import ElementLabel from "~/shared/ElementsLabel";
import Button from "~/shared/Button";
import { useStarknet } from "~/hooks/useStarknet";
import BridgeModal from "../bridge/Modal";
import {
  getTokenIdsForGame,
  ELEMENTS_ADDRESS,
  TOKEN_INDEX_OFFSET_BASE,
  getIsApprovedForAll,
} from "~/util/minigameApi";
import { GameStatus } from "~/types";
import useTxQueue from "~/hooks/useTxQueue";
const { getSelectorFromName } = stark;

type Prop = {
  gameIdx?: number;
  currentBoostBips?: number;
  gameStatus: GameStatus;
};

const GameControls: React.FC<Prop> = (props) => {
  const { gameIdx, currentBoostBips, gameStatus } = props;

  const starknet = useStarknet();
  const l2Address = useMemo(() => starknet.address, [starknet.address]);

  const txQueue = useTxQueue();

  const [tokenBalances, setTokenBalances] = useState<BN[]>();

  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [actionAmount, setActionAmount] = useState<string>("1");
  const [action, setAction] = useState<"shield" | "attack">();

  const [is1155TokenApproved, setIs1155TokenApproved] = useState<"1" | "0">();

  const side = 'light'

  const towerDefenceContractAddress = useModuleAddress("1");

  useEffect(() => {
    const getIsApproved = async (account: string, operator: string) => {
      const isApproved = await getIsApprovedForAll(account, operator);
      setIs1155TokenApproved(isApproved ? "1" : "0");
    };
    if (
      is1155TokenApproved == undefined &&
      l2Address &&
      towerDefenceContractAddress
    ) {
      getIsApproved(l2Address, towerDefenceContractAddress);
    }
  }, [towerDefenceContractAddress, l2Address]);

  const handleAttack = async (gameIndex: number, amount: number) => {
    const tokenId =
      gameIndex * TOKEN_INDEX_OFFSET_BASE + (side == "light" ? 1 : 2);

    await getStarknet().enable();
    const res = await getStarknet().signer?.invokeFunction(
      towerDefenceContractAddress as string,
      stark.getSelectorFromName("attack_tower"),
      [gameIndex.toString(), tokenId.toString(), (amount * 100).toString()]
    );

    if (res?.transaction_hash) {
      txQueue.addTransactionToQueue(
        res.transaction_hash,
        getSelectorFromName("attack_tower")
      );
    }
  };

  const handleShield = async (gameIndex: number, amount: number) => {
    const tokenId =
      gameIndex * TOKEN_INDEX_OFFSET_BASE + (side == "light" ? 1 : 2);

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
    if (res?.transaction_hash) {
      txQueue.addTransactionToQueue(
        res?.transaction_hash,
        getSelectorFromName("increase_shield")
      );
    }
  };


  return (
    <div
      id="game-actions"
      className="p-10 z-10 text-black backdrop-blur-md bg-white/30 rounded-2xl"
    >
      <BridgeModal
        isOpen={mintModalOpen}
        toggle={() => setMintModalOpen(false)}
      />

      {gameStatus == "expired" ? (
        <div>
          <p className="mt-8 text-3xl">
            {/*{side == "light" && tokenBalances ? (
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
            ) : null}*/}
          </p>
          <p className="my-4 text-xl animate-pulse">
            Waiting for next game to start...
          </p>
        </div>
      ) : (
        <>
          <p className="text-xl">
            {/*{side == undefined ? <>Side Not Chosen</> : null}
            {side == "light" ? (
              <>
                <ElementLabel side="light">LIGHT </ElementLabel>
                {tokenBalances && tokenBalances.length > 0
                  ? number.toBN(tokenBalances[0]).toString()
                  : null}
              </>
            ) : null}
            {side == "dark" ? (
              <>
                <ElementLabel side="dark">DARK</ElementLabel>{" "}
                {tokenBalances && tokenBalances.length > 1
                  ? number.toBN(tokenBalances[1]).toString()
                  : null}
              </>
                ) : null}*/}
          </p>

          <div className="flex w-full gap-4 text-gray-100 row">
            <div className="flex-1">
              <Button
                className="w-full mt-4 text-black"
                active={action == "shield"}
                onClick={() => setAction("shield")}
              >
                Shield
              </Button>
            </div>
            <div className="flex-1">
              <Button
                className="w-full mt-4 text-black"
                active={action == "attack"}
                onClick={() => setAction("attack")}
              >
                Attack
              </Button>
            </div>
          </div>
          <div className="flex flex-row justify-center my-4">
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
          {starknet.active && is1155TokenApproved == "1" ? (
            <Button
              color={"primary"}
              disabled={action == undefined || actionAmount.length == 0}
              className="w-full text-white"
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
          ) : null}
        </>
      )}
      {starknet.active == false ? (
        <Button
          className="w-full mt-4"
          color="default"
          onClick={() => starknet.connect()}
        >
          Connect StarkNet
        </Button>
      ) : null}
      {is1155TokenApproved == "0" ? (
        <>
          <button
            disabled={
              txQueue.status[getSelectorFromName("set_approval_for_all")] ==
              "loading"
            }
            onClick={() => {
              if (towerDefenceContractAddress) {
                getStarknet()
                  .signer?.invokeFunction(
                    ELEMENTS_ADDRESS,
                    getSelectorFromName("set_approval_for_all"),
                    [number.toBN(towerDefenceContractAddress).toString(), "1"]
                  )
                  .then((res) => {
                    if (res.transaction_hash) {
                      txQueue.addTransactionToQueue(
                        res.transaction_hash,
                        getSelectorFromName("set_approval_for_all")
                      );
                    }
                  });
              }
            }}
            className="w-full p-2 mt-4 text-white transition-colors border border-white rounded-md disabled:opacity-80 hover:bg-gray-700"
          >
            {txQueue.status[getSelectorFromName("set_approval_for_all")] ==
              "loading"
              ? "Approving Contract"
              : "Approve Elements Token"}
          </button>
        </>
      ) : undefined}
    </div>
  );
};
export default GameControls;
