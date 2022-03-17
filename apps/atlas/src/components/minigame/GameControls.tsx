import { LightningBoltIcon } from '@heroicons/react/outline';
import {
  useStarknet,
  useStarknetInvoke,
  useContract,
} from '@starknet-react/core';
import axios from 'axios';
import type BN from 'bn.js';
import classNames from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';
import type { Abi } from 'starknet';
import { number } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import TowerDefenceAbi from '@/abi/minigame/01_TowerDefence.json';
import Elements1155Abi from '@/abi/minigame/ERC1155_Mintable_Ownable.json';
import useGameStats from '@/hooks/useGameStats';
import { useSiegeBalance } from '@/hooks/useSiegeBalance';
import useTxCallback from '@/hooks/useTxCallback';
import Button from '@/shared/Button';
import ElementLabel from '@/shared/ElementsLabel';
import { ExternalLink } from '@/shared/Icons';
import LoadingSkeleton from '@/shared/LoadingSkeleton';
import type { GameStatus } from '@/types/index';
import {
  ELEMENTS_ADDRESS,
  TOKEN_INDEX_OFFSET_BASE,
  getIsApprovedForAll,
  EFFECT_BASE_FACTOR,
} from '@/util/minigameApi';
import Bridge from '../bridge/Bridge';
import BridgeModal from './Modal';
import {
  ShieldVitalityDisplay,
  ShieldVitalityDisplayClassnames,
} from './TowerShieldVitality';

type Prop = {
  gameIdx?: number;
  currentBoostBips?: number;
  health: BN;
  shield: BN;
  gameStatus?: GameStatus;
  setupModalInitialIsOpen?: boolean;
  towerDefenceContractAddress: string;
  towerDefenceStorageContractAddress: string;
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

enum OnboardingTutorials {
  GameControls = 'game-controls-tutorial',
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const GameControls: React.FC<Prop> = (props) => {
  const { gameIdx, currentBoostBips, gameStatus } = props;

  const {
    account,
    connectBrowserWallet,
    error: starknetConnectionError,
  } = useStarknet();

  useEffect(() => {
    connectBrowserWallet(); // on mount
  }, []);

  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    const previouslyShown = localStorage.getItem(
      OnboardingTutorials.GameControls
    );
    if (!previouslyShown && props.gameStatus == 'active') {
      setShowTutorial(true);
    }
  }, []);

  const towerDefenceContractAddress = props.towerDefenceContractAddress;

  const { contract: elementsContract } = useContract({
    abi: Elements1155Abi as Abi,
    address: ELEMENTS_ADDRESS,
  });
  const { contract: towerDefenceContract } = useContract({
    abi: TowerDefenceAbi as Abi,
    address: towerDefenceContractAddress,
  });
  const approve1155 = useStarknetInvoke({
    contract: elementsContract,
    method: 'setApprovalForAll',
  });
  const shieldAction = useStarknetInvoke({
    contract: towerDefenceContract,
    method: 'increase_shield',
  });
  const attackAction = useStarknetInvoke({
    contract: towerDefenceContract,
    method: 'attack_tower',
  });

  // const boostEffect = useStarknetCall({
  //   contract: towerDefenceContract,
  //   method: "calculate_time_multiplier",
  //   args: {
  //     game_idx:
  //   }
  // });

  const {
    fetchTokenBalances,
    tokenBalances,
    side,
    loading: loadingTokenBalance,
  } = useSiegeBalance();

  const txTracker = useTxCallback(
    shieldAction.data || attackAction.data,
    () => {
      fetchTokenBalances(gameIdx as number);

      // Temp: Post a request to distribute this as a notification
      // TODO: Replace with StarkNet indexer / real-time events in future
      axios
        .post('/api/notify', {
          token_amount: actionAmount,
          token_offset: side == 'light' ? '1' : '2',
          token_boost: currentBoostBips,
          game_idx: gameIdx,
          city_health: props.health
            .div(toBN(EFFECT_BASE_FACTOR))
            .toNumber()
            .toFixed(2),
          shield_health: props.shield
            .div(toBN(EFFECT_BASE_FACTOR))
            .toNumber()
            .toFixed(2),
        })
        .catch((e) => console.error(e)); // TODO: Handle error
    }
  );

  const [mintModalOpen, setMintModalOpen] = useState(
    props.setupModalInitialIsOpen == undefined
      ? false
      : props.setupModalInitialIsOpen
  );
  const [actionAmount, setActionAmount] = useState<string>('1');
  const [action, setAction] = useState<'shield' | 'attack'>();
  const [is1155TokenApproved, setIs1155TokenApproved] = useState<'1' | '0'>();

  useEffect(() => {
    setAction(side == 'light' ? 'shield' : 'attack');
  }, [side]);

  const getIsApproved = useCallback(
    async (account: string, operator: string) => {
      try {
        const isApproved = await getIsApprovedForAll(account, operator);
        setIs1155TokenApproved(isApproved ? '1' : '0');
      } catch (e) {
        // TODO: Handle error
        console.error('Error fetching token approval', e);
      }
    },
    [account]
  );

  const approveTracker = useTxCallback(approve1155.data, () => {
    getIsApproved(account as string, towerDefenceContractAddress);
  });

  useEffect(() => {
    if (is1155TokenApproved == undefined && account !== undefined) {
      getIsApproved(account, towerDefenceContractAddress);
    }
  }, [account]);

  useEffect(() => {
    if (account && gameIdx !== undefined && gameStatus !== undefined) {
      if (gameStatus == 'active') {
        // Fetch balances for current game
        fetchTokenBalances(gameIdx);
      } else {
        // Fetch & show balances for the upcoming game
        fetchTokenBalances(gameIdx + 1);
      }
    }
  }, [account, gameIdx, gameStatus]);

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

  const primaryBtnClass =
    'w-full p-2 mt-4 text-lg text-black transition-colors border border-white rounded-md bg-gray-200 hover:bg-white/100';

  const ConnectStarknetButton = () => (
    <button className={primaryBtnClass} onClick={() => connectBrowserWallet()}>
      Connect StarkNet
    </button>
  );

  const gameStats = useGameStats(
    gameIdx == undefined
      ? 0
      : props.gameStatus == 'active'
      ? gameIdx
      : gameIdx + 1,
    props.towerDefenceStorageContractAddress
  );

  const actionIsLoading =
    shieldAction.loading || attackAction.loading || txTracker.loading;

  const noMoreElements =
    tokenBalances &&
    tokenBalances.length > 0 &&
    tokenBalances.every((n) => n.isZero());

  return (
    <>
      <div
        id="shield-vitality-container"
        className={classNames(
          showTutorial ? '' : 'hidden',
          'absolute -right-56',
          ShieldVitalityDisplayClassnames
        )}
      >
        <ShieldVitalityDisplay
          shield={toBN(20 * EFFECT_BASE_FACTOR)}
          health={toBN(100 * EFFECT_BASE_FACTOR)}
        />
      </div>
      <BridgeModal
        isOpen={mintModalOpen}
        toggle={() => setMintModalOpen(false)}
      >
        <Bridge
          onComplete={() => {
            setMintModalOpen(false);
            // TODO: The balance isn't updated right away for some reason
            // Make this more robust or implement useStarknetCall in useSiegeBalance hook
            setTimeout(() => {
              fetchTokenBalances(gameIdx as number);
            }, 3000);
          }}
          onClose={() => setMintModalOpen(false)}
          towerDefenceStorageContractAddress={
            props.towerDefenceStorageContractAddress
          }
        />
      </BridgeModal>
      {!loadingTokenBalance && tokenBalances ? (
        <Joyride
          continuous
          run={showTutorial}
          showProgress
          callback={(data) => {
            const { status, action } = data;
            if (
              [STATUS.FINISHED, STATUS.SKIPPED].includes(status as any) ||
              action == ACTIONS.CLOSE
            ) {
              localStorage.setItem(OnboardingTutorials.GameControls, '1');
              setShowTutorial(false);
            }
          }}
          showSkipButton
          steps={[
            {
              title: <ElementLabel>Elements</ElementLabel>,
              target: '#token-balance',
              content: (
                <>
                  The amount of distilled{' '}
                  <ElementLabel side={side}>{side} elements</ElementLabel> in
                  your possession.
                </>
              ),
              disableBeacon: true,
            },
            {
              target: '#game-stats',
              content: (
                <>
                  Displays the ratio of total{' '}
                  <ElementLabel>Elements</ElementLabel> used so far, over the
                  total amount distilled, for each Element of this game.
                </>
              ),
            },
            {
              title: 'Spell Power',
              target: '#action-amount',
              content: (
                <>
                  A proper Mage carefully chooses the right amount of{' '}
                  <ElementLabel>Elements</ElementLabel> to power their spells.
                </>
              ),
            },
            {
              title: 'Portal Boost Effect',
              target: '#action-boost',
              content:
                'The Dark Portal bends space and time. The effect grows stronger with times passage, affecting ALL spells equally.',
            },
            {
              title: 'Shield and Vitality Indicator',
              target: '#shield-vitality-container',
              content:
                'Dark elements diminish the Light shield. When the Shield is gone, the City Vitality can be attacked directly.',
            },
          ]}
        />
      ) : null}
      <div>
        <p className="text-xl uppercase">Season 1</p>
        <h1>
          <ElementLabel> Divine Eclipse</ElementLabel>{' '}
        </h1>
      </div>
      {account == undefined ? <ConnectStarknetButton /> : null}
      {starknetConnectionError ? (
        <p className="mt-4 text-xl text-center text-red-700">
          Please install and unlock the{' '}
          <a
            className="underline"
            href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
          >
            {' '}
            ArgentX browser extension
          </a>{' '}
          to continue
        </p>
      ) : null}

      {(gameStatus == 'expired' || gameStatus == 'completed') && account ? (
        <div>
          {/* Side only undefined when token balances are equal, including 0-0 (they havent minted yet) */}
          {side == undefined && !loadingTokenBalance ? (
            <button
              onClick={() => {
                setMintModalOpen(true);
              }}
              className={primaryBtnClass}
            >
              <ElementLabel>Choose your Elements</ElementLabel>
            </button>
          ) : null}
          {loadingTokenBalance ? (
            <LoadingSkeleton className="w-24 h-10 mt-4" />
          ) : null}

          <p className="mt-4 text-3xl">
            {side == 'light' && tokenBalances ? (
              <>
                <ElementLabel side="light">LIGHT</ElementLabel>{' '}
                {(tokenBalances[0].toNumber() / 100).toFixed(0)}
              </>
            ) : null}
            {side == 'dark' && tokenBalances ? (
              <>
                <ElementLabel side="dark">DARK</ElementLabel>{' '}
                {(tokenBalances[1].toNumber() / 100).toFixed(0)}
              </>
            ) : null}
          </p>
          <p className="my-4 text-xl animate-bounce">
            Waiting for next game to start...
          </p>
          {gameStats.loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              Total minted for the next game
              <p>Light: {gameStats.light}</p>
              <p>Dark : {gameStats.dark}</p>
            </>
          )}
          <p className="mt-2 font-bold">Preparation for Desiege</p>
          <ul className="text-xl list-none">
            <li>
              Browse the{' '}
              <a
                target={'_blank'}
                href="https://docs.google.com/document/d/1LcT7QiprYOpK_3LfGN6MRBkqgULw7jQT3dIMSSi2vZg/edit?usp=sharing"
                rel="noreferrer"
                className="underline"
              >
                game guide
              </a>
              <ExternalLink className="inline-block h-4 ml-1" />
            </li>
            <li>
              Coordinate on{' '}
              <a
                target={'_blank'}
                href="https://discord.gg/YfeZQ3NFB8"
                className="underline"
                rel="noreferrer"
              >
                Discord
              </a>
              <ExternalLink className="inline-block h-4 ml-1" />
            </li>
            <li>
              <a className="underline">Recruit</a> your friends{' '}
              <span className="p-1 text-xs bg-blue-200">coming soon</span>
            </li>
            <li>
              Check the{' '}
              <a
                target={'_blank'}
                href="https://github.com/BibliothecaForAdventurers/realms-react/tree/feat/desiege/apps/atlas/src/components/minigame"
                className="underline"
                rel="noreferrer"
              >
                front-end
              </a>
              <ExternalLink className="inline-block h-4 ml-1" /> and{' '}
              <a
                target={'_blank'}
                href="https://github.com/BibliothecaForAdventurers/realms-contracts/tree/feature/desiege/contracts/desiege"
                className="underline"
                rel="noreferrer"
              >
                StarkNet
              </a>
              <ExternalLink className="inline-block h-4 ml-1" /> contracts
            </li>
          </ul>
        </div>
      ) : null}
      {gameStatus == 'active' && account ? (
        <>
          <div className="text-3xl">
            {loadingTokenBalance ? (
              <LoadingSkeleton className="h-10 mt-4 w-36" />
            ) : (
              <div className="mt-4">
                <div id="token-balance">
                  {noMoreElements ? (
                    <p>
                      No <ElementLabel>Elements</ElementLabel> for this game{' '}
                      <button
                        onClick={() => {
                          setMintModalOpen(true);
                        }}
                        className={primaryBtnClass}
                      >
                        <ElementLabel>Prepare for the next Game</ElementLabel>
                      </button>
                    </p>
                  ) : null}
                  {side == 'light' ? (
                    <>
                      <ElementLabel side="light">LIGHT </ElementLabel>
                      {tokenBalances && tokenBalances.length > 0
                        ? number
                            .toBN(tokenBalances[0])
                            .div(number.toBN(EFFECT_BASE_FACTOR)) // Normalize units
                            .toString()
                        : null}
                    </>
                  ) : null}
                  {side == 'dark' ? (
                    <>
                      <ElementLabel side="dark">DARK</ElementLabel>{' '}
                      {tokenBalances && tokenBalances.length > 1
                        ? number
                            .toBN(tokenBalances[1])
                            .div(number.toBN(EFFECT_BASE_FACTOR)) // Normalize units
                            .toString()
                        : null}
                    </>
                  ) : null}
                </div>
                {gameStats.loading ? (
                  <LoadingSkeleton className="w-full h-4" />
                ) : (
                  <div id="game-stats">
                    <div className="w-full h-2 mt-2 bg-cyan-800">
                      {gameStats.lightUsed !== undefined &&
                      gameStats.light !== undefined ? (
                        <div
                          style={{
                            width: `${gameStats.lightUsed / gameStats.light}%`,
                          }}
                          className="h-2 transition-all bg-cyan-300"
                        ></div>
                      ) : undefined}
                    </div>
                    <div className="w-full h-2 mt-2 bg-purple-800">
                      {gameStats.darkUsed !== undefined &&
                      gameStats.dark !== undefined ? (
                        <div
                          style={{
                            width: `${gameStats.darkUsed / gameStats.dark}%`,
                          }}
                          className="h-2 bg-purple-300"
                        ></div>
                      ) : undefined}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            id="action-controls"
            className="flex w-full gap-4 text-gray-100 row"
          >
            {/* <div className="flex-1">
              {side == "light" ? (
                <Button
                  className="w-full mt-4 text-black"
                  onClick={() => setAction("shield")}
                >
                  Shield
                </Button>
              ) : (
                <Button
                  className="w-full mt-4 text-black"
                  active={action == "attack"}
                  onClick={() => setAction("attack")}
                >
                  Attack
                </Button>
              )}
            </div> */}
          </div>
          <div className="flex flex-row justify-center my-4">
            <input
              id="action-amount"
              type="number"
              placeholder="Amount"
              min={0}
              value={actionAmount}
              onChange={(e) => {
                if (parseInt(e.target.value)) {
                  setActionAmount(e.target.value);
                } else {
                  setActionAmount('');
                }
              }}
              className="w-40 px-6 py-4 text-4xl bg-gray-200 border-2 rounded-md"
            />{' '}
            <div id="action-boost" className="ml-4">
              {currentBoostBips && !isNaN(currentBoostBips) ? (
                <button className="p-2 font-semibold text-white align-middle transition-colors bg-blue-900 rounded-md hover:bg-blue-800">
                  <LightningBoltIcon className="inline-block w-4" />{' '}
                  {`${currentBoostBips / 100}%`}
                </button>
              ) : null}
            </div>
          </div>
          {account !== undefined && is1155TokenApproved == '1' ? (
            <Button
              color={'primary'}
              disabled={
                action == undefined ||
                actionAmount.length == 0 ||
                actionIsLoading ||
                noMoreElements ||
                gameStats.loading
              }
              className={classNames(primaryBtnClass)}
              onClick={() => {
                if (gameIdx) {
                  if (action == 'shield') {
                    handleShield(gameIdx, parseInt(actionAmount));
                  } else if (action == 'attack') {
                    handleAttack(gameIdx, parseInt(actionAmount));
                  }
                }
              }}
            >
              {actionIsLoading
                ? 'Casting Spell'
                : `Cast ${action == 'shield' ? 'Shield' : 'Dark Attack'} Spell`}
            </Button>
          ) : null}
          {(shieldAction.data || attackAction.data) && actionIsLoading ? (
            <p className="mt-2">
              <a
                // TODO: Choose host dynamically here based on network
                href={`https://goerli.voyager.online/tx/${
                  shieldAction.data || attackAction.data
                }/`}
                className="underline"
                target={'_blank'}
                rel="noopener noreferrer"
              >
                Check Transaction Status
              </a>
              <ExternalLink className="inline-block h-4 ml-1" />
            </p>
          ) : null}
          <button
            className="w-full my-2 text-center underline"
            onClick={() => setShowTutorial(true)}
          >
            Show Tutorial
          </button>
        </>
      ) : null}
      {is1155TokenApproved == '0' ? (
        <>
          <Button
            disabled={approve1155.loading || approveTracker.loading}
            onClick={() => {
              approve1155.invoke({
                args: [
                  number.toBN(towerDefenceContractAddress).toString(),
                  '1',
                ],
              });
            }}
            className={primaryBtnClass}
          >
            {approve1155.loading || approveTracker.loading
              ? 'Approving...'
              : 'Approve Elements Token'}
          </Button>
        </>
      ) : undefined}
    </>
  );
};
export default GameControls;
