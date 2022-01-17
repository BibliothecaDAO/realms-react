import React, { useEffect, useState } from "react";
import BN from "bn.js";
import { ElementToken } from "~/constants";
import {
  getLatestGameIndex,
  getMainHealth,
  getShieldValue,
} from "~/util/minigameApi";
import Button from "~/shared/Button";

type Prop = {
  tokenId: ElementToken;
};

const ShieldGame: React.FC<Prop> = (props) => {
  const [gameIdx, setGameIdx] = useState<string>();
  const [mainHealth, setMainHealth] = useState<BN | undefined>();
  const [shieldValue, setShieldValue] = useState<BN | undefined>();

  useEffect(() => {
    const fetchState = async () => {
      const gameIdx = await getLatestGameIndex();

      const gameQueries = await Promise.all([
        getMainHealth(gameIdx),
        getShieldValue(gameIdx, props.tokenId),
      ]);

      setGameIdx(gameIdx);
      setMainHealth(gameQueries[0]);
      setShieldValue(gameQueries[1]);
    };
    fetchState();
  }, []);

  return (
    <>
      <h3>Current Game Index: {gameIdx}</h3>
      <p>
        You&apos;ve chosen the{" "}
        {props.tokenId == ElementToken.Light ? "Light" : "Dark"}
      </p>

      <p>Main health: {mainHealth?.toString()}</p>
      <p>Shield Value: {shieldValue?.toString()}</p>
      <br />
      {props.tokenId == ElementToken.Light ? (
        <Button>Shield Boost</Button>
      ) : null}
      {props.tokenId == ElementToken.Dark ? (
        <Button>Attack Shield</Button>
      ) : null}
    </>
  );
};
export default ShieldGame;
