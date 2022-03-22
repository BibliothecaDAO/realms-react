import { IconButton } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Mountain from '@bibliotheca-dao/ui-lib/icons/mountain.svg';
import { useCallback } from 'react';
import { useSound } from '@/context/soundProvider';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';

export const MenuSideBar = () => {
  const { account } = useWalletContext();
  const { toggleMenuType, mainMenu, toggleArtBackground, togglePanelType } =
    useUIContext();
  const { isSoundActive, toggleSound } = useSound();

  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  const buttonClasses =
    'bg-gray-800 border-none text-gray-300 mx-7 mt-4 hover:text-stone-200 hover:bg-stone-500 shadow-inner';
  const iconClasses = 'w-6 mx-auto sm:w-10 fill-current mb-1';
  const textClasses =
    'hidden font-bold text-center text-gray-300 uppercase text-shadow-xs tracking-veryWide sm:block mt-2 mb-5';

  return (
    <div
      className={`w-full pt-4 sm:h-screen bottom-0 sm:w-36 sm:left-0 sm:top-0  bg-gray-800/80 z-40 shadow-inner flex sm:flex-col transform duration-300 transition-all overflow-auto ${
        mainMenu ? '' : 'translate-y-full hidden'
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

      <IconButton
        className={buttonClasses}
        aria-label="Loot"
        onClick={() => toggleMenuType('loot')}
        icon={<Bag className={'mx-auto w-10 fill-current'} />}
        size="lg"
      />
      <span className={textClasses}>Loot</span>

      <IconButton
        className={buttonClasses}
        onClick={() => toggleMenuType('ga')}
        aria-label="GA"
        icon={<Helm className={'mx-auto w-8 sm:w-8 fill-current'} />}
        size="lg"
      />
      <span className={textClasses}>GA</span>

      <IconButton
        className={buttonClasses}
        onClick={() => toggleMenuType('crypt')}
        aria-label="Crypts"
        icon={<Danger className={iconClasses} />}
        size="lg"
      />
      <span className={textClasses}>Crypts</span>

      <IconButton
        className={buttonClasses}
        onClick={() => toggleArtBackground()}
        aria-label="Trade"
        icon={<Mountain className={iconClasses} />}
        size="lg"
      />
      <span className={textClasses}>Trade</span>

      <IconButton
        className={buttonClasses}
        aria-label="Bank"
        onClick={() => toggleMenuType('orders')}
        icon={<Library className={iconClasses} />}
        size="lg"
      />
      <span className={textClasses}>Bank</span>
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
  );
};
