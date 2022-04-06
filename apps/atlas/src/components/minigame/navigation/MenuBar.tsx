import React from 'react';
import { DocumentText } from '@/shared/Icons';
import type { DesiegeTab } from '../ShieldGame';
import { ActionsBox } from './ActionsBox';
import { ManaBall } from './ManaBall';
type Prop = {
  gameIdx?: number;
  setupModalInitialIsOpen?: boolean;
  toggleTab?: (tab: DesiegeTab) => void;
};
function MenuBar(props: Prop) {
  const buttonClasses =
    'w-full h-16  border bg-gradient-to-b bg-white/60  from-white/80 rounded hover:-translate-y-1 transform hover:bg-blue-100 uppercase text-blue-400 shadow-xl transition-all duration-300 px-8';
  return (
    <div className="fixed z-50 flex items-center justify-between w-full px-10 py-2 bottom-12 rounded-t-3xl">
      <ManaBall side={'light'} />
      <div className="flex flex-row justify-between w-auto gap-4 p-4 text-blue-700 border-blue-200 rounded bg-white/60 outline-double outline-3 outline-offset-2">
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
      </div>
      <ActionsBox />
      <ManaBall side={'dark'} />
    </div>
  );
}

export default MenuBar;
