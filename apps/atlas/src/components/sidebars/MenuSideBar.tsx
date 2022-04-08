import { IconButton, Button } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Bank from '@bibliotheca-dao/ui-lib/icons/bank.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Eth from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import Scale from '@bibliotheca-dao/ui-lib/icons/scale.svg';
import { animated, useSpring } from '@react-spring/web';
import { useCallback } from 'react';
import { useSound } from '@/context/soundProvider';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';

export const MenuSideBar = () => {
  const { account, connectWallet } = useWalletContext();
  const { toggleMenuType, mainMenu, toggleMainMenu, togglePanelType } =
    useUIContext();
  const { isSoundActive, toggleSound } = useSound();

  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  const animation = useSpring({
    opacity: mainMenu ? 0.85 : 0,
  });

  const buttonClasses =
    'bg-gray-800 border-none text-gray-300 w-14 h-14 sm:w-20 sm:h-20 align-self-center mt-4 hover:text-stone-200 hover:bg-stone-500 shadow-inner';
  const iconClasses = 'w-6 mx-auto sm:w-10 fill-current mb-1';
  const textClasses =
    'hidden font-bold text-center text-gray-300 uppercase text-shadow-xs tracking-veryWide sm:block mt-2 mb-5';

  return (
    <div>
      <div>
        <button
          className="absolute z-50 p-4 transition-all rounded sm:hidden top-2 left-2"
          onClick={() => toggleMainMenu()}
        >
          {mainMenu ? <Close /> : <Menu />}
        </button>
      </div>
      <animated.div
        style={animation}
        className={`absolute sm:relative align-items-center sm:pt-4 h-full sm:!opacity-100 px-2 bottom-0 lg:w-32 sm:left-0 pt-16 sm:top-0  bg-gray-800 z-40 shadow-inner flex flex-col transform duration-300 transition-all overflow-auto ${
          mainMenu ? '' : 'translate-y-full hidden sm:transform-none sm:block'
        }`}
      >
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={buttonClasses}
            aria-label="Realms"
            onClick={() => {
              togglePanelType('realm');
            }}
            icon={<Castle className={iconClasses} />}
            size="lg"
          />

          <span className={textClasses}>Realms</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={buttonClasses}
            aria-label="Loot"
            onClick={() => togglePanelType('loot')}
            icon={<Bag className={'mx-auto w-10 fill-current'} />}
            size="lg"
          />
          <span className={textClasses}>Loot</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={buttonClasses}
            onClick={() => togglePanelType('ga')}
            aria-label="GA"
            icon={<Helm className={'mx-auto w-7  fill-current'} />}
            size="lg"
          />
          <span className={textClasses}>GA</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={buttonClasses}
            onClick={() => togglePanelType('crypt')}
            aria-label="Crypts"
            icon={<Danger className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Crypts</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={buttonClasses}
            onClick={() => togglePanelType('trade')}
            aria-label="Trade"
            icon={<Scale className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Trade</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={buttonClasses}
            aria-label="Bank"
            onClick={() => togglePanelType('bank')}
            icon={<Bank className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Bank</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={buttonClasses}
            aria-label="Desiege"
            href="/desiege"
            icon={<Bank className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Desiege</span>
        </div>
        {/* <button
      {/* <button
        className="p-4 py-8 text-xl hover:bg-white/30 text-off-200"
        onClick={handleClick}
      >
        {!isSoundActive ? (
          <VolumeMuteIcon className="w-8 mx-auto" />
        ) : (
          <VolumeIcon className="w-8 mx-auto" />
        )}
      </button> */}

        <div className="grow" />
        <div className="flex flex-col mb-2 sm:hidden place-items-center">
          <IconButton
            className={buttonClasses}
            aria-label="Connect Wallet"
            onClick={connectWallet}
            icon={<Eth className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}></span>
        </div>
      </animated.div>
    </div>
  );
};
