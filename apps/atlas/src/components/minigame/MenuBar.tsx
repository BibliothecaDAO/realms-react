import { useRouter } from 'next/router';
import React from 'react';
import Button from '@/shared/Button';
import type { DesiegeTab } from './ShieldGame';

type Prop = {
  toggleTab?: (tab: DesiegeTab) => void;
};

function MenuBar(props: Prop) {
  const router = useRouter();

  return (
    <div className="fixed z-10 w-full text-black transition-all bottom-10">
      <div className="flex justify-around px-4 mx-auto align-middle w-96 rounded uppercase p-2 shadow-sm text-2xl space-x-8">
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
  );
}

export default MenuBar;
