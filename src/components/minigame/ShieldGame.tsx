import React, { useEffect, useState } from "react";
import BN from "bn.js";
import { ElementToken } from "~/constants";
import {
  getLatestGameIndex,
  getMainHealth,
  getShieldValue,
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
  const [mainHealth, setMainHealth] = useState<BN>();
  const [shieldValue, setShieldValue] = useState<
    Record<ElementToken, BN> | undefined
  >();

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
    ]);

    setGameIdx(gameIdx);
    setMainHealth(gameQueries[0]);
    setShieldValue({
      [ElementToken.Light]: gameQueries[1],
      [ElementToken.Dark]: gameQueries[2],
    });
    setTokenBalance(number.toBN(gameQueries[3].result[0]));
  };

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

  // Stick to just single shielding/attack amount for now
  const actionAmount = 1;

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
          Shield Value:{" "}
          {shieldValue ? shieldValue[ElementToken.Dark].toString() : "-"}
        </p>
      ) : null}
      {props.tokenId == ElementToken.Dark ? (
        <p>
          Shield Value:{" "}
          {shieldValue ? shieldValue[ElementToken.Light].toString() : "-"}
        </p>
      ) : null}

      <br />
      <Button onClick={() => handleAttack(actionAmount)}>Boost Shield</Button>
      <Button className="mb-4 ml-2" onClick={() => handleShield(actionAmount)}>
        Attack Shield
      </Button>
      {mainHealth ? <Castle health={mainHealth.toNumber()} /> : null}
    </>
  );
};
export default ShieldGame;
