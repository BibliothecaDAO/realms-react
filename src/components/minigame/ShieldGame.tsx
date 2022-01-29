import React, { useEffect, useState } from "react";
import BN from "bn.js";
import { ElementToken } from "~/constants";
import { getGameContextVariables } from "~/util/minigameApi";
import Button from "~/shared/Button";
import ElementLabel from "~/shared/ElementsLabel";
import { getStarknet } from "@argent/get-starknet/dist";
import { defaultProvider, number, stark } from "starknet";
import { useModuleAddress } from "~/hooks/useModuleAddress";
import { waitForTransaction } from "~/hooks/useStarknet";
import Castle from "./Castle";
import { toBN } from "starknet/dist/utils/number";

const ELEMENT_TOKEN_ADDRESS = process.env
  .NEXT_PUBLIC_MINIGAME_ELEMENTS_ADDRESS as string;

type Prop = {
  tokenId: ElementToken;
  l2AccountAddress: string;
};

const ShieldGame: React.FC<Prop> = (props) => {
  const [actionAmount, setActionAmount] = useState<string>("1");
  const [action, setAction] = useState<"shield" | "attack">();

  // Contract state
  const [gameIdx, setGameIdx] = useState<string>();
  const [mainHealth, setMainHealth] = useState<BN>();
  const [_startBlockNum, setStartBlockNum] = useState<string>();
  const [shieldValue, _setShieldValue] = useState<
    Record<ElementToken, string> | undefined
  >();

  const [boost, setBoost] = useState<number>();

  const [tokenBalance, _setTokenBalance] = useState<string>();

  const towerDefenceContractAddress = useModuleAddress("1");

  const fetchState = async () => {
    const gameCtx = await getGameContextVariables();

    setGameIdx(gameCtx.gameIdx);
    setMainHealth(toBN(gameCtx.mainHealth));
    setStartBlockNum(gameCtx.gameStartBlock);
    setBoost(gameCtx.currentBoost);
  };

  // Fetch state on mount
  useEffect(() => {
    fetchState();
  }, []);

  const handleAttack = async (amount: number) => {
    await getStarknet().enable();
    const res = await getStarknet().signer?.invokeFunction(
      towerDefenceContractAddress as string,
      stark.getSelectorFromName("attack_tower"),
      [gameIdx as string, props.tokenId.toString(), amount.toString()]
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
        props.tokenId.toString(),
        // The boost is automatically processed contract-side
        (amount * 100).toString(),
      ]
    );
    await waitForTransaction(res?.transaction_hash as string);
    console.log("shield transaction finished");
    await fetchState();
  };

  return (
    <>
      <h3 className="text-2xl text-center">
        Game # {gameIdx ? toBN(gameIdx).toNumber() : null}
      </h3>
      <div className="flex flex-row justify-between mx-60">
        <div id="game-actions">
          <p className="text-xl">
            <ElementLabel>ELEMENTS</ElementLabel>
            <br />
            {props.tokenId == ElementToken.Light ? "Light" : "Dark"}{" "}
            {tokenBalance?.toString()}
          </p>
          <br />
          <Button onClick={() => setAction("shield")}>Boost Shield</Button>
          <Button className="mb-4 ml-2" onClick={() => setAction("attack")}>
            Attack Shield
          </Button>
          <br />
          {action ? (
            <>
              <p className="text-xl">{action}</p>
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
                max={tokenBalance}
                className="px-3 py-2 border-2 rounded-md w-28"
              />{" "}
              {boost && !isNaN(boost) ? (
                <span className="p-1 font-semibold text-white bg-blue-800 rounded-md">
                  + {boost / 100}
                  <span className="ml-1 text-xs">%</span>
                </span>
              ) : null}
              <br />
              <Button
                className="mt-2"
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
            </>
          ) : null}
        </div>
        <div id="fortress-container">
          <p className="text-4xl">Fortress</p>
          <p className="text-2xl">
            Vitality: {mainHealth?.div(toBN(100)).toNumber().toFixed(2)}
          </p>
          {props.tokenId == ElementToken.Light ? (
            <p>
              Dark Shield Value:{" "}
              {shieldValue ? shieldValue[ElementToken.Dark].toString() : "-"}
            </p>
          ) : null}
          {props.tokenId == ElementToken.Dark ? (
            <p>
              Light Shield Value:{" "}
              {shieldValue ? shieldValue[ElementToken.Light].toString() : "-"}
            </p>
          ) : null}
          {mainHealth ? <Castle health={mainHealth.toNumber()} /> : null}
        </div>
      </div>
    </>
  );
};
export default ShieldGame;
