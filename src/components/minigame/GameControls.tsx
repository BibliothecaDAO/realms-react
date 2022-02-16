import { useState, useEffect } from "react";
import { Abi, number, stark } from "starknet";
import { getStarknet } from "@argent/get-starknet/dist";
import { useModuleAddress } from "~/hooks/useModuleAddress";
import { useSiegeBalance } from "~/hooks/useSiegeBalance";
import ElementLabel from "~/shared/ElementsLabel";
import Button from "~/shared/Button";
import {
  useStarknet,
  useStarknetInvoke,
  useContract,
} from "@starknet-react/core";
import BridgeModal from "../bridge/Modal";
import {
  ELEMENTS_ADDRESS,
  TOKEN_INDEX_OFFSET_BASE,
  getIsApprovedForAll,
} from "~/util/minigameApi";
import { GameStatus } from "~/types";
import Elements1155Abi from "~/abi/minigame/ERC1155.json";
import TowerDefenceAbi from "~/abi/minigame/01_TowerDefence.json";

type Prop = {
  gameIdx?: number;
  currentBoostBips?: number;
  gameStatus: GameStatus;
};

type TokenNameOffsetMap = Record<string, number>;

// Maps a token name to an offset index
// TOKEN_INDEX_OFFSET_BASE = 10
// means there are 9-10 slots
const divineEclipse: TokenNameOffsetMap = {
  light: 1,
  dark: 2,
};

// The offset is based on the season mapping
const currentTokenOffset = divineEclipse;

// Contract calculates effects in BIPS
// so this factor is used to normalize action amounts
const EFFECT_BASE_FACTOR = 100;

const GameControls: React.FC<Prop> = (props) => {
  const { gameIdx, currentBoostBips, gameStatus } = props;

  const { account, connectBrowserWallet } = useStarknet();

  const towerDefenceContractAddress = useModuleAddress("1");

  const { contract: elementsContract } = useContract({
    abi: Elements1155Abi.abi as Abi[],
    address: ELEMENTS_ADDRESS,
  });
  const { contract: towerDefenceContract } = useContract({
    // @ts-ignore
    abi: TowerDefenceAbi.abi as Abi[],
    address: towerDefenceContractAddress,
  });
  const approve1155 = useStarknetInvoke({
    contract: elementsContract,
    method: "set_approval_for_all",
  });
  const shieldAction = useStarknetInvoke({
    contract: towerDefenceContract,
    method: "increase_shield",
  });
  const attackAction = useStarknetInvoke({
    contract: towerDefenceContract,
    method: "attack_tower",
  });

  const { fetchTokenBalances, tokenBalances, side } = useSiegeBalance();

  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [actionAmount, setActionAmount] = useState<string>("1");
  const [action, setAction] = useState<"shield" | "attack">();

  const [is1155TokenApproved, setIs1155TokenApproved] = useState<"1" | "0">();

  useEffect(() => {
    const getIsApproved = async (account: string, operator: string) => {
      const isApproved = await getIsApprovedForAll(account, operator);
      setIs1155TokenApproved(isApproved ? "1" : "0");
    };
    if (
      is1155TokenApproved == undefined &&
      account !== undefined &&
      towerDefenceContractAddress
    ) {
      getIsApproved(account, towerDefenceContractAddress);
    }
  }, [towerDefenceContractAddress, account]);

  useEffect(() => {
    if (account && gameIdx !== undefined) {
      if (gameStatus == "active") {
        // Fetch balances for current game
        fetchTokenBalances(gameIdx);
      } else {
        // Fetch & show balances for the upcoming game
        fetchTokenBalances(gameIdx + 1);
      }
    }
  }, [account, gameIdx]);

  const handleAttack = async (gameIndex: number, amount: number) => {
    const tokenId =
      gameIndex * TOKEN_INDEX_OFFSET_BASE + currentTokenOffset[side as string];
    attackAction.invoke({
      args: [
        gameIndex.toString(),
        tokenId.toString(),
        (amount * EFFECT_BASE_FACTOR).toString(),
      ],
    });
  };

  const handleShield = async (gameIndex: number, amount: number) => {
    const tokenId =
      gameIndex * TOKEN_INDEX_OFFSET_BASE + currentTokenOffset[side as string];
    shieldAction.invoke({
      args: [
        gameIndex.toString(),
        tokenId.toString(),
        (amount * EFFECT_BASE_FACTOR).toString(),
      ],
    });
  };

  return (
    <div
      id="game-actions"
      className="z-10 w-1/3 p-10 text-black backdrop-blur-md bg-white/30 rounded-2xl"
    >
      <BridgeModal
        isOpen={mintModalOpen}
        toggle={() => setMintModalOpen(false)}
      />
      <div>
        <p className="text-xl uppercase">Season 1</p>
        <h1>
          <ElementLabel> Divine Eclipse</ElementLabel>{" "}
        </h1>
      </div>

      {gameStatus == "expired" ? (
        <div>
          {side == undefined ? (
            <button
              onClick={() => {
                if (account != undefined && side == undefined) {
                  setMintModalOpen(true);
                } else {
                  connectBrowserWallet();
                }
              }}
              className="w-full p-2 mt-4 text-lg text-white transition-colors border border-white rounded-md backdrop-blur-lg bg-white/30 hover:bg-white/100"
            >
              {/* Side only undefined when token balances are equal, including 0-0 (they havent minted yet) */}
              {account !== undefined ? (
                <>
                  <ElementLabel>Choose your Elements</ElementLabel>
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
          <ul className="text-xl list-none">
            <li>
              Browse the <a className="underline">game guide</a>
            </li>
            <li>
              Coordinate on <a className="underline"> Discord</a>
            </li>
            <li>
              <a className="underline">Recruit</a> your friends
            </li>
            <li>
              See the <a className="underline">front-end</a> and{" "}
              <a className="underline">StarkNet</a> contracts
            </li>
          </ul>
        </div>
      ) : (
        <>
          <p className="text-3xl">
            {side == undefined ? <>Side Not Chosen</> : null}
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
            ) : null}
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
          {account !== undefined && is1155TokenApproved == "1" ? (
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
      {account == undefined ? (
        <Button
          className="w-full mt-4"
          color="default"
          onClick={connectBrowserWallet}
        >
          Connect StarkNet
        </Button>
      ) : null}
      {is1155TokenApproved == "0" ? (
        <>
          <button
            disabled={approve1155.loading}
            onClick={() => {
              if (towerDefenceContractAddress) {
                approve1155.invoke({
                  args: [
                    number.toBN(towerDefenceContractAddress).toString(),
                    "1",
                  ],
                });
              }
            }}
            className="w-full p-2 mt-4 text-white transition-colors bg-gray-700 border border-white rounded-md disabled:opacity-80"
          >
            Approve Elements Token
          </button>
        </>
      ) : undefined}
    </div>
  );
};
export default GameControls;
