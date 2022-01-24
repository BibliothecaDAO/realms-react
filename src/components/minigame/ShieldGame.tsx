import React, { useEffect, useState } from "react";
import BN from "bn.js";
import { ElementToken } from "~/constants";
import {
  getLatestGameIndex,
  getMainHealth,
  getShieldValue,
  getTokenRewardPool,
  getTotalRewardAlloc,
  getUserRewardAlloc,
  ShieldGameRole,
} from "~/util/minigameApi";
import Button from "~/shared/Button";
import ElementLabel from "~/shared/ElementsLabel";
import { getStarknet } from "@argent/get-starknet/dist";
import { defaultProvider, number, stark } from "starknet";
import { useModuleAddress } from "~/hooks/useModuleAddress";
import { waitForTransaction } from "~/hooks/useStarknet";
import Castle from "./Castle";

const ELEMENT_TOKEN_ADDRESS = process.env
  .NEXT_PUBLIC_MINIGAME_ELEMENTS_ADDRESS as string;

type Prop = {
  tokenId: ElementToken;
  l2AccountAddress: string;
};

const ShieldGame: React.FC<Prop> = (props) => {
  const [gameIdx, setGameIdx] = useState<string>();
  const [actionAmount, setActionAmount] = useState<number>(1);
  const [action, setAction] = useState<"shield" | "attack">();
  const [mainHealth, setMainHealth] = useState<BN>();
  const [shieldValue, setShieldValue] = useState<
    Record<ElementToken, BN> | undefined
  >();

  const [userAllocation, setUserAllocation] = useState<BN>();
  const [totalRewardAllocation, setTotalRewardAllocation] = useState<BN>();
  const [tokenRewardPool, setTokenRewardPool] = useState<BN>();

  const [tokenBalance, setTokenBalance] = useState<BN>();

  const towerDefenceContractAddress = useModuleAddress("1");

  const fetchState = async () => {
    const gameIdx = await getLatestGameIndex();

    const gameQueries = await Promise.all([
      getMainHealth(gameIdx),
      getShieldValue(gameIdx, ElementToken.Light),
      getShieldValue(gameIdx, ElementToken.Dark),
      // get element token balance
      defaultProvider.callContract({
        contract_address: ELEMENT_TOKEN_ADDRESS,
        entry_point_selector: stark.getSelectorFromName("balance_of"),
        calldata: [props.l2AccountAddress, props.tokenId.toString()],
      }),
      getUserRewardAlloc(
        gameIdx,
        props.l2AccountAddress,
        ShieldGameRole.Shielder
      ),
      getTotalRewardAlloc(gameIdx, ShieldGameRole.Shielder),
      getTokenRewardPool(gameIdx, props.tokenId),
    ]);

    setGameIdx(gameIdx);
    setMainHealth(gameQueries[0]);
    setShieldValue({
      [ElementToken.Light]: gameQueries[1],
      [ElementToken.Dark]: gameQueries[2],
    });
    setTokenBalance(number.toBN(gameQueries[3].result[0]));
    setUserAllocation(gameQueries[4]);
    setTotalRewardAllocation(gameQueries[5]);
    setTokenRewardPool(gameQueries[6]);
  };

  const actionBig = number.toBN(actionAmount);

  // Calculate the pool share after the user action
  const nextPoolAllocation =
    userAllocation && totalRewardAllocation
      ? totalRewardAllocation.add(actionBig).div(userAllocation.add(actionBig))
      : undefined;

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
      [gameIdx as string, props.tokenId.toString(), amount.toString()]
    );
    await waitForTransaction(res?.transaction_hash as string);
    console.log("shield transaction finished");
    await fetchState();
  };

  return (
    <>
      <h3 className="text-2xl">Game # {gameIdx}</h3>
      <p className="text-xl">
        <ElementLabel>ELEMENTS</ElementLabel>
        <br />
        {props.tokenId == ElementToken.Light ? "Light" : "Dark"}{" "}
        {tokenBalance?.toString()}
      </p>

      <p className="text-2xl">Fortress</p>
      <p>Vitality: {mainHealth?.toString()}</p>
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
                setActionAmount(parseInt(e.target.value));
              } else {
                setActionAmount(0);
              }
            }}
            max={tokenBalance?.toNumber()}
            className="px-3 py-2 border w-28"
          />{" "}
          {actionAmount !== undefined ? (
            <>
              <p>
                Token elements {tokenBalance?.toString()} -&gt;{" "}
                {tokenBalance?.sub(number.toBN(actionAmount || 0)).toString()}
              </p>
              {totalRewardAllocation && userAllocation ? (
                <p>
                  Your share of pool from{" "}
                  {totalRewardAllocation.div(userAllocation).toNumber()}% to{" "}
                  {nextPoolAllocation?.toNumber()}%
                </p>
              ) : null}
              <p>If you win, you can claim {/* TODO */}</p>
            </>
          ) : null}
          <Button
            onClick={() => {
              if (action == "shield") {
                handleShield(actionAmount);
              } else if (action == "attack") {
                handleAttack(actionAmount);
              }
            }}
          >
            Confirm Transaction
          </Button>
        </>
      ) : null}

      {mainHealth ? <Castle health={mainHealth.toNumber()} /> : null}
    </>
  );
};
export default ShieldGame;
