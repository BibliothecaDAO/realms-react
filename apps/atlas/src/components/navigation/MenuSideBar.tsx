import { IconButton } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Eth from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Laurel from '@bibliotheca-dao/ui-lib/icons/laurel.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/sword.svg';
import { animated, useSpring } from '@react-spring/web';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState, useMemo } from 'react';
import { useBreakpoint } from '@/hooks/useBreakPoint';

export const MenuSideBar = () => {
  const breakpoints: any = useBreakpoint();
  const [showMenu, setShowMenu] = useState(breakpoints.lg);
  const { query, pathname } = useRouter();

  const isPage = useCallback(
    (name: string) => name === pathname.slice(1).split('/')[0],
    [pathname]
  );
  const getPageHref = useCallback(
    (name: string) =>
      name === (query.segment && query.segment[0]) ? '/' : `/${name}`,
    [query]
  );
  const animation = useSpring({
    opacity: showMenu ? 1 : 0.7,
  });

  const buttonClasses =
    'border-b-4  border-l-2 border-transparent w-14 h-14 sm:w-20 sm:h-20 align-self-center mt-1 hover:bg-cta-100 shadow-2xl rounded-full hover:shadow-purple-500 transition-all duration-450 transform hover:-translate-y-1 hover:border-yellow-200/40 hover:fill-yellow-600 hover:bg-cta-100 hover:bg-gradient-to-r hover:from-orange-500 background-animate slow transition-all shimmer paper';

  const textClasses =
    'hidden invisible font-display text-center lowercase sm:block lg:mb-5 mb-2 text-xl group-hover:visible ';

  const iconClasses = (page) => {
    return `w-6 mx-auto sm:w-8 ${
      isPage(page) ? ' fill-yellow-100' : 'fill-gray-300'
    }`;
  };

  const menus = useMemo(() => {
    return [
      {
        page: '',
        icon: <Globe className={`${iconClasses('')}`} />,
        text: 'atlas',
      },
      {
        page: 'account',
        icon: <Crown className={`${iconClasses('account')}`} />,
        text: 'empire',
      },
      {
        page: 'realm',
        icon: <Castle className={`${iconClasses('realm')}`} />,
        text: 'Realms',
      },
      {
        page: 'bank',
        icon: <Lords className={`${iconClasses('bank')}`} />,
        text: 'Bank',
      },
      {
        page: 'loot',
        icon: <Bag className={`${iconClasses('loot')}`} />,
        text: 'Loot',
      },
      {
        page: 'ga',
        icon: <Sword className={`${iconClasses('ga')}`} />,
        text: 'GA',
      },
      {
        page: 'crypt',
        icon: <Danger className={`${iconClasses('crypt')}`} />,
        text: 'Crypts',
      },
      {
        page: 'lore',
        icon: <Library className={`${iconClasses('lore')}`} />,
        text: 'Lore',
      },
      {
        page: 'leaderboard',
        icon: <Laurel className={`${iconClasses('leaderboard')}`} />,
        text: 'Leaders',
      },
      // {
      //   page: 'noticeBoard',
      //   icon: <Library className={iconClasses} />,
      //   text: 'Rulers',
      // },

      // {
      //   page: 'combat',
      //   icon: <Shield className={iconClasses} />,
      //   text: 'Combat',
      // },
    ];
  }, [query]);

  return (
    <div>
      <div>
        <button
          className="absolute z-50 p-4 transition-all rounded sm:hidden top-2 left-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <Close /> : <Menu />}
        </button>
      </div>
      <animated.div
        style={animation}
        id="menuSidebar"
        className={`absolute sm:relative align-items-center sm:pt-4 h-full sm:!opacity-100 px-2 bottom-0 lg:w-32 sm:left-0 pt-16 sm:top-0 bg-gray-1100 z-40 shadow-md flex flex-col transform  overflow-auto border-r-4 border-white/20 shadow-white/30 card ${
          showMenu ? '' : 'translate-y-full hidden sm:transform-none sm:block'
        }`}
      >
        {menus.map((menu) => (
          <Link href={getPageHref(menu.page)} key={menu.page} shallow={true}>
            <div className="flex flex-col place-items-center group">
              <IconButton
                className={`${buttonClasses}  ${
                  isPage(menu.page)
                    ? 'bg-cta-100 bg-gradient-to-r from-orange-500 shadow-purple-500 -translate-y-1 border-yellow-700 fill-yellow-600    '
                    : ''
                }`}
                aria-label={menu.text}
                variant="unstyled"
                texture={false}
                icon={menu.icon}
                size="md"
              />

              <span className={textClasses}>{menu.text}</span>
            </div>
          </Link>
        ))}

        <div className="grow" />
        <div className="block sm:hidden">
          {/* TODO: Re-enable */}
          {/* <TransactionNavItem onClick={() => {}} /> */}
        </div>

        <div className="flex flex-col mb-2 sm:hidden place-items-center">
          <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, address, ensName }) => {
              return (
                <IconButton
                  className={buttonClasses}
                  aria-label="Connect Wallet"
                  onClick={show}
                  icon={<Eth className={'w-6 mx-auto sm:w-8'} />}
                  size="lg"
                />
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </animated.div>
    </div>
  );
};
