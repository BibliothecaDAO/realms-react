import { useRouter } from 'next/router';
import React from 'react';
import Button from '@/shared/Button';
import type { DesiegeTab } from '../ShieldGame';

type Prop = {
  toggleTab?: (tab: DesiegeTab) => void;
};

function MenuBar(props: Prop) {
  const router = useRouter();

  return (
    <div className="fixed flex justify-between w-full bottom-24 px-10 z-50 ">
      <div className="rounded-full w-64 h-64 bottom-6 right-6 bg-conic-to-t from-rose-500 via-blue-200 to-rose-400 shimmer slow background-animate fast transition-all duration-150 flex justify-center p-4 text-blue-900 shadow-inner">
        <span className="self-center text-center text-3xl">
          {' '}
          Light Spells <br />
          40/40
        </span>
      </div>
      <div className="bg-white">
        <div className="flex justify-around px-4 mx-auto align-middle w-96 rounded uppercase p-2 text-2xl space-x-8">
          <Button
            onClick={() => {
              props.toggleTab && props.toggleTab('game-controls');
              router.replace('/desiege?tab=game-controls', undefined, {
                shallow: true,
              });
            }}
          >
            Game
          </Button>
          <Button
            onClick={() => {
              props.toggleTab && props.toggleTab('lore');
              router.replace('/desiege?tab=lore', undefined, {
                shallow: true,
              });
            }}
          >
            Lore
          </Button>
        </div>
      </div>
      <div className="rounded-full w-64 h-64 bg-conic-to-t from-rose-500 via-violet-900 to-rose-800 shimmer flow background-animate slow transition-all duration-150 flex justify-center p-4 shadow-inner">
        {' '}
        <span className="self-center text-center text-3xl">
          {' '}
          Dark Spells <br />
          40/40
        </span>
      </div>
    </div>
  );
}

export default MenuBar;
