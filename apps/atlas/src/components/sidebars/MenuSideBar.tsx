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
import Shield from '@bibliotheca-dao/ui-lib/icons/shield.svg';
import { animated, useSpring } from '@react-spring/web';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';

export const MenuSideBar = () => {
  const { account, connectWallet } = useWalletContext();
  const {
    toggleMenuType,
    mainMenu,
    toggleMainMenu,
    togglePanelType,
    selectedPanel,
  } = useUIContext();

  const animation = useSpring({
    opacity: mainMenu ? 0.85 : 0,
  });

  const buttonClasses =
    'bg-transparent border-none text-gray-300 w-14 h-14 sm:w-20 sm:h-20 align-self-center mt-4 hover:text-stone-200 hover:bg-stone-500 shadow-inner rounded-xl';
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
        className={`absolute sm:relative align-items-center sm:pt-4 h-full sm:!opacity-100 px-2 bottom-0 lg:w-32 sm:left-0 pt-16 sm:top-0  bg-gray-800 z-40 shadow-2xl flex flex-col transform duration-300 transition-all overflow-auto ${
          mainMenu ? '' : 'translate-y-full hidden sm:transform-none sm:block'
        }`}
      >
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={`${buttonClasses} ${
              selectedPanel === 'realm' ? 'bg-gray-700' : ''
            }`}
            aria-label="Realms"
            variant="unstyled"
            texture={false}
            onClick={() => {
              togglePanelType('realm');
            }}
            icon={<Castle className={`${iconClasses}`} />}
            size="lg"
          />

          <span className={textClasses}>Realms</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={`${buttonClasses} ${
              selectedPanel === 'loot' ? 'bg-gray-700' : ''
            }`}
            aria-label="Loot"
            variant="unstyled"
            texture={false}
            onClick={() => togglePanelType('loot')}
            icon={<Bag className={`${iconClasses}`} />}
            size="lg"
          />
          <span className={textClasses}>Loot</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={`${buttonClasses} ${
              selectedPanel === 'ga' ? 'bg-gray-700' : ''
            }`}
            onClick={() => togglePanelType('ga')}
            aria-label="GA"
            variant="unstyled"
            texture={false}
            icon={<Helm className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>GA</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={`${buttonClasses} ${
              selectedPanel === 'crypt' ? 'bg-gray-700' : ''
            }`}
            onClick={() => togglePanelType('crypt')}
            aria-label="Crypts"
            variant="unstyled"
            texture={false}
            icon={<Danger className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Crypts</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={`${buttonClasses} ${
              selectedPanel === 'trade' ? 'bg-gray-700' : ''
            }`}
            onClick={() => togglePanelType('trade')}
            aria-label="Trade"
            variant="unstyled"
            texture={false}
            icon={<Scale className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Trade</span>
        </div>
        <div className="flex flex-col place-items-center ">
          <IconButton
            className={`${buttonClasses} ${
              selectedPanel === 'bank' ? 'bg-gray-700' : ''
            }`}
            aria-label="Bank"
            variant="unstyled"
            texture={false}
            onClick={() => togglePanelType('bank')}
            icon={<Bank className={iconClasses} />}
            size="lg"
          />
          <span className={textClasses}>Bank</span>
        </div>

        {/* <div className="flex flex-col place-items-center ">
          <IconButton
            className={`${buttonClasses} ${
              selectedPanel === 'bank' ? 'bg-gray-700' : ''
            }`}
            aria-label="Desiege"
            href="/desiege"
            variant="unstyled"
            texture={false}
            icon={<Shield className={'w-10 mx-auto mt-4 fill-current'} />}
            size="lg"
          />
          <span className={textClasses}>Desiege</span>
        </div> */}
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
