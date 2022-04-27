import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { UserAgent } from '@quentin-sommer/react-useragent';
import { useStarknet } from '@starknet-react/core';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import use1155Approval from '@/hooks/desiege/use1155Approval';
import useGameStatus from '@/hooks/desiege/useGameStatus';
import useGameVariables from '@/hooks/desiege/useGameVariables';
import { useTokenBalances } from '@/hooks/desiege/useTokenBalances';
import Button from '@/shared/Button';
import ElementLabel from '@/shared/ElementsLabel';
import LoadingSkeleton from '@/shared/LoadingSkeleton';
import { EFFECT_BASE_FACTOR } from '@/util/minigameApi';

import {
  CityVitalityDisplay,
  ShieldVitalityDisplay,
} from '../TowerShieldVitality';
import { GamePreparation } from './GamePreparation';
import Tutorial from './Onboarding/GameActions';

const ChatComponent = dynamic(() => import('../realtime/Chat'), { ssr: false });

type Prop = {
  onChooseElements: () => void;
};

enum OnboardingTutorials {
  GameControls = 'game-controls-tutorial',
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const GameControls: React.FC<Prop> = (props) => {
  const {
    account,
    connectBrowserWallet,
    error: starknetConnectionError,
  } = useStarknet();

  useEffect(() => {
    connectBrowserWallet(); // on mount
  }, []);

  const gameVars = useGameVariables();

  const gameStatus = useGameStatus({
    gameIdx: gameVars.data?.gameIdx,
  });

  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    const previouslyShown = localStorage.getItem(
      OnboardingTutorials.GameControls
    );
    if (!previouslyShown && gameStatus.data == 'active') {
      setShowTutorial(true);
    }
  }, []);

  const contractApproval = use1155Approval();

  let gameIdx;
  if (gameVars.data && gameStatus.data) {
    if (gameStatus.data == 'active') {
      gameIdx = gameVars.data.gameIdx;
    } else {
      gameIdx = gameVars.data.gameIdx + 1;
    }
  }
  const userBalance = useTokenBalances({
    gameIdx,
  });

  const primaryBtnClass =
    'w-full p-2 my-4 text-lg bg-white text-black transition-colors border border-white rounded-md  hover:bg-gray-200 font-body tracking-widest duration-150';

  const ConnectStarknetButton = () => (
    <button className={primaryBtnClass} onClick={() => connectBrowserWallet()}>
      Connect StarkNet
    </button>
  );
  return (
    <div className="text-gray-800">
      <Tutorial
        didShowTutorial={() => setShowTutorial(true)}
        onCloseTutorial={() => setShowTutorial(false)}
        showTutorial={showTutorial}
      />
      <div
        id="shield-indicator"
        className={classNames(
          showTutorial ? '' : 'hidden',
          'absolute -right-full'
        )}
      >
        <ShieldVitalityDisplay
          shield={toBN(100 * EFFECT_BASE_FACTOR)}
          health={toBN(100 * EFFECT_BASE_FACTOR)}
        />
      </div>
      <div
        id="vitality-indicator"
        className={classNames(
          showTutorial ? '' : 'hidden',
          'absolute -right-64'
        )}
      >
        <CityVitalityDisplay
          shield={toBN(100 * EFFECT_BASE_FACTOR)}
          health={toBN(100 * EFFECT_BASE_FACTOR)}
        />
      </div>
      <div className="font-bold">
        <p className="mt-1 text-xl tracking-widest text-gray-800 uppercase">
          Season 1
        </p>
        <h1 className="text-5xl">
          <ElementLabel> Divine Eclipse</ElementLabel>{' '}
        </h1>
      </div>
      {account == undefined ? <ConnectStarknetButton /> : null}
      {starknetConnectionError ? (
        <div className="p-4 text-xl text-center text-gray-800 bg-orange-100 rounded-md">
          <UserAgent chrome>
            {(uaIsChrome) =>
              uaIsChrome ? (
                <>
                  Please install and unlock the{' '}
                  <a
                    className="underline"
                    href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                  >
                    {' '}
                    ArgentX browser extension
                  </a>{' '}
                  to continue
                </>
              ) : (
                <p className="text-base text-orange-800">
                  {' '}
                  <ExclamationCircleIcon className="inline-block w-4 text-orange-800" />{' '}
                  A StarkNet compatible wallet is not available on your browser
                </p>
              )
            }
          </UserAgent>
        </div>
      ) : null}
      {gameStatus.data == 'expired' ||
      gameStatus.data == 'completed' ||
      gameStatus.data == undefined ? (
        <>
          <br />
          <GamePreparation />
        </>
      ) : null}
      {(gameStatus.data == 'expired' || gameStatus.data == 'completed') &&
      account ? (
        <div className="my-4">
          {userBalance.side == undefined && !userBalance.loading ? (
            <Button onClick={props.onChooseElements}>
              <ElementLabel>Choose your Elements</ElementLabel>
            </Button>
          ) : null}
          {userBalance.loading ? (
            <LoadingSkeleton className="w-full h-10" />
          ) : null}
        </div>
      ) : null}
      {gameStatus.data == 'active' && account ? (
        <>
          {/* <div className="text-3xl">
            {loadingTokenBalance ? (
              <LoadingSkeleton className="h-10 mt-4 w-36" />
            ) : (
              <div className="mt-4">
                <div id="token-balance">
                  {noMoreElements ? (
                    <p className="tracking-widest uppercase opacity-60">
                      No <ElementLabel>Elements</ElementLabel> for this game{' '}
                      <Button
                        onClick={() => {
                          setMintModalOpen(true);
                        }}
                        className={primaryBtnClass}
                      >
                        <ElementLabel>Prepare for the next Game</ElementLabel>
                      </Button>
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </div> */}

          <button
            className="mb-2 text-center underline cursor-pointer"
            onClick={() => setShowTutorial(true)}
          >
            Show Tutorial
          </button>
        </>
      ) : null}

      {contractApproval.approvalStatus == 'not-approved' ? (
        <>
          <Button
            disabled={contractApproval.isApproving}
            onClick={() => {
              contractApproval.invoke();
            }}
            className={primaryBtnClass}
          >
            {contractApproval.isApproving ? 'Approving...' : 'Approve Contract'}
          </Button>
        </>
      ) : undefined}

      <ChatComponent channelName="desiege-chat" />
    </div>
  );
};
export default GameControls;
