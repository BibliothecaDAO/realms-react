import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';
import { useUIContext } from '@/hooks/useUIContext';
import { CryptsEmpire } from './CryptsEmpire';
import { RealmsEmpire } from './RealmsEmpire';
type Props = {
  onClick?: (event: any, id: number) => void;
};

export const EmpireSideBar = (props: Props) => {
  const { toggleEmpireMenu, empireMenu } = useUIContext();
  const [tab, setTab] = useState<string>('Realms');

  const animation = useSpring({
    opacity: empireMenu ? 1 : 0,
    transform: empireMenu ? `translateY(0)` : `translateY(-200%)`,
  });

  return (
    <animated.div
      className="absolute top-0 z-40 w-full backdrop-blur-md bg-off-200/90"
      style={animation}
    >
      <div
        className={`h-screen w-full relative z-60 top-0 p-6   rounded-r-2xl overflow-y-scroll`}
      >
        <div className="flex justify-between">
          <h1 className="mb-4">My Empire</h1>
          <button
            className="p-4 mb-8 transition-all rounded bg-white/20 hover:bg-white/70"
            onClick={toggleEmpireMenu}
          >
            CLOSE
          </button>
        </div>

        <div className="flex my-8 space-x-6 text-primary">
          <button
            className={`flex flex-col text-2xl  rounded px-8 py-4 hover:bg-white/30 ${
              tab === 'Realms' ? 'bg-white/30' : 'bg-white/10'
            }`}
            onClick={() => setTab('Realms')}
          >
            {' '}
            <Castle className="w-8 mx-auto fill-current" />{' '}
            <span className="self-center ">Realms</span>
          </button>
          <button
            className={`flex flex-col text-2xl  rounded px-8 py-4 hover:bg-white/30 ${
              tab !== 'Realms' ? 'bg-white/30' : 'bg-white/10'
            }`}
            onClick={() => setTab('Crypts')}
          >
            {' '}
            <Danger className="w-8 mx-auto fill-current" /> Crypts
          </button>
        </div>
        {tab === 'Realms' ? (
          <RealmsEmpire onClick={props.onClick} />
        ) : (
          <CryptsEmpire onClick={props.onClick} />
        )}
      </div>
    </animated.div>
  );
};
