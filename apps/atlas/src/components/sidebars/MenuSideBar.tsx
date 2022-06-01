import { IconButton } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Bank from '@bibliotheca-dao/ui-lib/icons/bank.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Eth from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import Scale from '@bibliotheca-dao/ui-lib/icons/scale.svg';
import { animated, useSpring } from '@react-spring/web';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { useWalletContext } from '@/hooks/useWalletContext';

export const MenuSideBar = () => {
  const { connectWallet } = useWalletContext();
  const { mainMenu, toggleMainMenu } = useAtlasContext();
  const { query } = useRouter();

  const isPage = useCallback(
    (name: string) => name === (query.segment && query.segment[0]),
    [query]
  );
  const getPageHref = useCallback(
    (name: string) =>
      name === (query.segment && query.segment[0]) ? '/' : `/${name}`,
    [query]
  );
  const animation = useSpring({
    opacity: mainMenu ? 0.85 : 0,
  });

  const buttonClasses =
    'bg-transparent border-none text-gray-300 w-14 h-14 sm:w-20 sm:h-20 align-self-center mt-4 hover:text-stone-200 hover:bg-stone-500 shadow-inner rounded-xl';
  const iconClasses = 'w-6 mx-auto sm:w-10 fill-current mb-1';
  const textClasses =
    'hidden font-bold text-center text-gray-300 uppercase text-shadow-xs tracking-veryWide sm:block mt-2 mb-5 font-lords';

  const menus = useMemo(() => {
    return [
      {
        page: 'realm',
        icon: <Castle className={`${iconClasses}`} />,
        text: 'Realms',
      },
      {
        page: 'loot',
        icon: <Bag className={`${iconClasses}`} />,
        text: 'Loot',
      },
      {
        page: 'ga',
        icon: <Helm className={iconClasses} />,
        text: 'GA',
      },
      {
        page: 'crypt',
        icon: <Danger className={iconClasses} />,
        text: 'Crypts',
      },
      {
        page: 'bank',
        icon: <Bank className={iconClasses} />,
        text: 'Bank',
      },
      {
        page: 'combat',
        icon: <Danger className={iconClasses} />,
        text: 'Combat',
      },
    ];
  }, [query]);

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
        {menus.map((menu) => (
          <Link href={getPageHref(menu.page)} key={menu.page}>
            <div className="flex flex-col place-items-center ">
              <IconButton
                className={`${buttonClasses} ${
                  isPage(menu.page) ? 'bg-gray-700' : ''
                }`}
                aria-label={menu.text}
                variant="unstyled"
                texture={false}
                icon={menu.icon}
                size="lg"
              />

              <span className={textClasses}>{menu.text}</span>
            </div>
          </Link>
        ))}

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
