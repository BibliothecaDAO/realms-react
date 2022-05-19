import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import useSound from 'use-sound';
import { DocumentText, VolumeOff, VolumeUp } from '@/shared/Icons';
import type { DesiegeTab } from '../ShieldGame';
import VictoryDisplay from '../VictoryDisplay';
import { ManaBall } from './ManaBall';

// Must not be loaded on server as uses client-side only components (websockets)
const ActionsBox = dynamic(() => import('./ActionsBox'), { ssr: false });

type Prop = {
  gameIdx?: number;
  setupModalInitialIsOpen?: boolean;
  toggleTab?: (tab: DesiegeTab) => void;
};
function MenuBar(props: Prop) {
  const [soundOn, setSoundOn] = useState(false);
  const [play, { stop }] = useSound(
    '/music/scott-buckley-i-walk-with-ghosts.mp3',
    {
      volume: 1,
    }
  );

  const buttonClasses =
    'w-full p-4 xl:p-6 border bg-gradient-to-b bg-white/60  from-white/80 rounded hover:-translate-y-1 transform hover:bg-blue-100 uppercase text-blue-400 shadow-xl transition-all duration-300';
  return (
    <div className="fixed z-50 flex items-center justify-between w-full px-10 py-2 bottom-12 rounded-t-3xl">
      <ManaBall side={'light'} />
      <div>
        <VictoryDisplay gameIdx={props.gameIdx}>
          {(darkVictory) => (
            <>{darkVictory ? 'Dark' : 'Light'} Wins, check rewards </>
          )}
        </VictoryDisplay>

        <div className="flex flex-row justify-between w-auto gap-4 p-2 text-blue-700 border-blue-200 rounded bg-white/60 outline-double outline-3 outline-offset-2">
          <button
            className={buttonClasses}
            onClick={() => {
              props.toggleTab && props.toggleTab('lore');
            }}
          >
            Lore
          </button>
          <button
            className={buttonClasses}
            onClick={() => {
              props.toggleTab && props.toggleTab('check-rewards');
            }}
          >
            Rewards
          </button>
          <button
            className={buttonClasses}
            onClick={() => {
              props.toggleTab && props.toggleTab('contracts');
            }}
          >
            <DocumentText className="w-6" />
          </button>
          <button
            className="text-blue-400 hover:scale-110 hover:text-blue-800"
            onClick={() => {
              if (soundOn) {
                stop();
              } else {
                play();
              }
              setSoundOn((prev) => !prev);
            }}
          >
            {soundOn ? (
              <VolumeUp className="w-6" />
            ) : (
              <VolumeOff className="w-6" />
            )}
          </button>
        </div>
      </div>
      <ActionsBox />
      <ManaBall side={'dark'} />
    </div>
  );
}

export default MenuBar;
