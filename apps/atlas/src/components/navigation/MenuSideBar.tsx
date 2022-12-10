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
import { useUIContext } from '@/context/UIContext';
import type { AssetType } from '@/hooks/useAtlasMap';
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
    ' border-transparent w-6 h-6 lg:w-[2.6rem] lg:h-12 align-self-center mt-1 shadow-2xl rounded-full  transition-all duration-450 transform background-animate  paper';

  const iconClasses = (page) => {
    return `lg:w-5 mx-auto w-2  hover:fill-white transition-all duration-450  ${
      isPage(page) ? ' fill-white' : 'fill-yellow-600 '
    }`;
  };

  const menus = useMemo(() => {
    return [
      {
        page: '',
        icon: <Globe className={`${iconClasses('')}`} />,
        text: 'atlas',
      },
      // {
      //   page: 'account',
      //   icon: <Crown className={`${iconClasses('account')}`} />,
      //   text: 'empire',
      // },
      {
        page: '?asset=realm0',
        icon: <Castle className={`${iconClasses('realm')}`} />,
        text: 'Realms',
        sidebar: 'realm' as AssetType,
      },
      {
        page: 'bank',
        icon: <Lords className={`${iconClasses('bank')}`} />,
        text: 'Bank',
      },
      // {
      //   page: 'loot',
      //   icon: <Bag className={`${iconClasses('loot')}`} />,
      //   text: 'Loot',
      // },
      // {
      //   page: 'ga',
      //   icon: <Sword className={`${iconClasses('ga')}`} />,
      //   text: 'GA',
      // },
      // {
      //   page: 'crypt',
      //   icon: <Danger className={`${iconClasses('crypt')}`} />,
      //   text: 'Crypts',
      // },
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
  const { closeAll, assetSidebar, openAsset } = useUIContext();
  return (
    <div className="absolute z-40">
      <div>
        <button
          className="absolute z-50 p-4 transition-all rounded sm:hidden top-2 left-2 "
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <Close /> : <Menu />}
        </button>
      </div>
      <div
        className={`sm:relative px-2 bottom-0 sm:left-0 sm:top-0 z-40 flex flex-col overflow-auto h-screen  justify-center mx-1 `}
      >
        <div className="py-8 rounded-full bg-gray-1000">
          {menus.map((menu) => (
            <Link
              onClick={() => {
                closeAll();
                menu.sidebar && openAsset(menu.sidebar);
              }}
              href={getPageHref(menu.page)}
              key={menu.page}
              shallow={true}
            >
              <div className="flex flex-col place-items-center group">
                <IconButton
                  className={`${buttonClasses}  ${
                    isPage(menu.page) ||
                    (menu.text == 'Realms' && assetSidebar == 'realm')
                      ? ''
                      : ' '
                  }`}
                  aria-label={menu.text}
                  variant="unstyled"
                  texture={false}
                  icon={menu.icon}
                  size="md"
                />

                {/* <span className={textClasses}>{menu.text}</span> */}
              </div>
            </Link>
          ))}
        </div>

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
      </div>
    </div>
  );
};
