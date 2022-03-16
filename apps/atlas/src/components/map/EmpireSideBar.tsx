import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';
import { useUIContext } from '@/hooks/useUIContext';
import { CryptsEmpire } from './CryptsEmpire';
import { GAEmpire } from './GAEmpire';
import { LootEmpire } from './LootEmpire';
import { RealmsEmpire } from './RealmsEmpire';

export const EmpireSideBar = () => {
  const { toggleMenuType, selectedMenuType } = useUIContext();
  const [tab, setTab] = useState<string>('Realms');
  const activeBg = 'bg-white/30';
  const inactiveBg = 'bg-white/10';

  const isEmpireMenu = selectedMenuType === 'empire';
  const animation = useSpring({
    opacity: isEmpireMenu ? 1 : 0,
    transform: isEmpireMenu ? `translateY(0)` : `translateY(-200%)`,
  });

  return (
    <animated.div
      className="absolute top-0 z-40 w-full w-screen h-screen bg-center bg-cover bg-off-200/90"
      style={animation}
    >
      <div
        className={`h-screen w-full relative z-60 top-0 p-6   rounded-r-2xl overflow-y-scroll`}
      >
        <div className="flex justify-between">
          <h1 className="mb-4">My Empire</h1>
          <button
            className="p-4 mb-8 transition-all rounded bg-white/20 hover:bg-white/70"
            onClick={() => toggleMenuType('empire')}
          >
            CLOSE
          </button>
        </div>

        <div className="flex my-8 space-x-6 text-primary">
          <button
            className={`flex flex-col text-2xl  rounded px-8 py-4 hover:bg-white/30 ${
              tab === 'Realms' ? activeBg : inactiveBg
            }`}
            onClick={() => setTab('Realms')}
          >
            {' '}
            <Castle className="w-8 mx-auto mb-1 fill-current" />{' '}
            <span className="self-center ">Realms</span>
          </button>
          <button
            className={`flex flex-col text-2xl  rounded px-8 py-4 hover:bg-white/30 ${
              tab === 'Crypts' ? activeBg : inactiveBg
            }`}
            onClick={() => setTab('Crypts')}
          >
            {' '}
            <Danger className="w-8 mx-auto mb-1 fill-current" /> Crypts
          </button>
          <button
            className={`flex flex-col text-2xl  rounded px-8 py-4 hover:bg-white/30 ${
              tab === 'Loot' ? activeBg : inactiveBg
            }`}
            onClick={() => setTab('Loot')}
          >
            {' '}
            <Bag className="w-10 mx-auto fill-current" /> Loot
          </button>
          <button
            className={`flex flex-col text-2xl  rounded px-8 py-4 hover:bg-white/30 ${
              tab === 'GA' ? activeBg : inactiveBg
            }`}
            onClick={() => setTab('GA')}
          >
            {' '}
            <Helm className="w-5 mx-auto mb-2 fill-current" /> GA
          </button>
        </div>
        {tab === 'Realms' && <RealmsEmpire />}
        {tab === 'Crypts' && <CryptsEmpire />}
        {tab === 'Loot' && <LootEmpire />}
        {tab === 'GA' && <GAEmpire />}
      </div>
    </animated.div>
  );
};
