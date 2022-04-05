import { IconButton } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import Mountain from '@bibliotheca-dao/ui-lib/icons/mountain.svg';
import { useCallback } from 'react';
import { useSound } from '@/context/soundProvider';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';

export const MenuSideBar = () => {
  const { account } = useWalletContext();
  const { toggleMenuType, mainMenu, toggleMainMenu, togglePanelType } =
    useUIContext();
  const { isSoundActive, toggleSound } = useSound();

  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  const buttonClasses =
    'bg-gray-800 border-none text-gray-300 w-14 h-14 sm:w-20 sm:h-20 sm:mx-7 mx-3 mt-4 hover:text-stone-200 hover:bg-stone-500 shadow-inner';
  const iconClasses = 'w-6 mx-auto sm:w-10 fill-current mb-1';
  const textClasses =
    'hidden font-bold text-center text-gray-300 uppercase text-shadow-xs tracking-veryWide sm:block mt-2 mb-5';

  return (
    <div>
      <div>
        <button
          className="absolute z-50 p-4 transition-all rounded sm:hidden top-4 left-4"
          onClick={() => toggleMainMenu()}
        >
          <Menu />
        </button>
      </div>
      <div
        className={`w-22 absolute sm:relative sm:pt-4 h-full bottom-0 sm:w-36 sm:left-0 pt-24 sm:top-0  bg-gray-800/80 z-40 shadow-inner flex flex-col transform duration-300 transition-all overflow-auto ${
          mainMenu ? '' : 'translate-y-full hidden sm:transform-none sm:block'
        }`}
      >
        <div>
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
        <div>
          <IconButton
            className={buttonClasses}
            aria-label="Loot"
            onClick={() => togglePanelType('loot')}
            icon={<Bag className={'mx-auto w-10 fill-current'} />}
            size="lg"
          />
          <span className={textClasses}>Loot</span>
        </div>
        <div>
          <IconButton
            className={buttonClasses}
            onClick={() => togglePanelType('ga')}
            aria-label="GA"
            icon={<Helm className={'mx-auto w-7  fill-current'} />}
            size="lg"
          />
          <span className={textClasses}>GA</span>
        </div>
        <div>
          <IconButton
            className={buttonClasses}
            onClick={() => toggleMenuType('crypt')}
            aria-label="Crypts"
            icon={<Danger className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Crypts</span>
        </div>
        <div>
          <IconButton
            className={buttonClasses}
            onClick={() => togglePanelType('trade')}
            aria-label="Trade"
            icon={<Mountain className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Trade</span>
        </div>
        <div>
          <IconButton
            className={buttonClasses}
            aria-label="Bank"
            onClick={() => togglePanelType('bank')}
            icon={<Library className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Bank</span>
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
      </div>
    </div>
  );
};
