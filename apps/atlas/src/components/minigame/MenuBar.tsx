import { useRouter } from 'next/router';
import React from 'react';
import type { DesiegeTab } from './ShieldGame';

type Prop = {
  toggleTab?: (tab: DesiegeTab) => void;
};

function MenuBar(props: Prop) {
  const router = useRouter();

  return (
    <div className="absolute w-full text-black transition-all bottom-2 ">
      <div className="flex justify-around h-12 px-4 mx-auto align-middle w-96 rounded-2xl bg-white/40">
        <button
          className="self-center mute-btn hover:scale-105 hover:text-blue-700"
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
          className="self-center mute-btn hover:scale-105 hover:text-blue-700"
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
