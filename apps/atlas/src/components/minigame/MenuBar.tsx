import { useRouter } from 'next/router';
import React from 'react';
import type { DesiegeTab } from './ShieldGame';

type Prop = {
  toggleTab?: (tab: DesiegeTab) => void;
};

function MenuBar(props: Prop) {
  const router = useRouter();

  return (
    <div className="fixed z-10 w-full text-black transition-all bottom-10">
      <div className="flex justify-around h-12 px-4 mx-auto align-middle w-96 rounded bg-white/40 uppercase p-2 shadow-sm text-2xl">
        <button
          className="self-center mute-btn hover:scale-105 hover:text-blue-700 uppercase tracking-widest font-body hover:bg-white/50 h-full w-full rounded"
          onClick={() => {
            props.toggleTab && props.toggleTab('game-controls');
            router.replace('/desiege?tab=game-controls', undefined, {
              shallow: true,
            });
          }}
        >
          Game
        </button>
        <button
          className="self-center mute-btn hover:scale-105 hover:text-blue-700 uppercase tracking-widest font-body hover:bg-white/50 h-full w-full rounded"
          onClick={() => {
            props.toggleTab && props.toggleTab('lore');
            router.replace('/desiege?tab=lore', undefined, {
              shallow: true,
            });
          }}
        >
          Lore
        </button>
      </div>
    </div>
  );
}

export default MenuBar;
