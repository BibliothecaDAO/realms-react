import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/BibliothecaBook.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import Discord from '@bibliotheca-dao/ui-lib/icons/social/discord.svg';
import Github from '@bibliotheca-dao/ui-lib/icons/social/github.svg';
import Link from 'next/link';
import { useState } from 'react';

import { links } from '@/data/Projects';
import { useWalletContext } from '@/hooks/useWalletContext';

export const MainHeader = () => {
  const {
    lordsPrice,
    connectWallet,
    displayName,
    isConnected,
    disconnectWallet,
  } = useWalletContext();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const headerElements = [
    // {
    //   title: 'DAO',
    //   icon: <Discord className="self-center w-6 mr-3 fill-current" />,
    // },
    {
      title: 'Staking',
      icon: '',
      link: 'https://staking.bibliothecadao.xyz',
      class: ' hidden sm:block',
    },
    {
      title: 'Discord',
      icon: <Discord className="self-center w-6 fill-current sm:mr-4" />,
      link: links[0].discord,
    },
    {
      title: 'Github',
      icon: <Github className="self-center w-6 fill-current sm:mr-4" />,
      link: links[0].github,
    },
  ];
  return (
    <div className="fixed z-50 flex w-full h-16 px-4 space-x-8 tracking-widest uppercase border-b sm:px-10 bg-gray-900/40 border-off-300">
      {' '}
      <div className="container flex justify-between mx-auto text-white">
        <Link href="/">
          <BibliothecaBook className="self-center mr-10 transition-all duration-150 cursor-pointer fill-current h-9 hover:fill-white" />
        </Link>

        <Link href="/treasury">
          <a className="self-center hidden px-4 py-1 mr-auto transition-all duration-150 border rounded sm:flex border-off-300/20 hover:bg-off-300 hover:text-gray-900">
            <span className="hidden sm:block">DAO | </span> ${lordsPrice}{' '}
            <Lords className="self-center h-4 ml-4 fill-current" />
          </a>
        </Link>

        <div className="flex sm:space-x-4">
          {isConnected && (
            <>
              {displayName ? (
                <button
                  className="flex self-center px-4 py-1 py-3 mr-auto text-sm transition-all duration-150 border rounded border-off-300/20 hover:bg-off-300 hover:text-gray-900"
                  onClick={disconnectWallet}
                >
                  {displayName}
                </button>
              ) : null}
            </>
          )}
          {!isConnected && (
            <button
              className="flex self-center px-4 py-1 mr-auto transition-all duration-150 border rounded border-off-300/20 hover:bg-off-300 hover:text-gray-900"
              onClick={connectWallet}
            >
              connect
            </button>
          )}

          <Link href="/claim">
            <a className="self-center hidden px-4 py-1 mr-auto transition-all duration-150 border rounded md:flex border-off-300/20 hover:bg-off-300 hover:text-gray-900">
              claim
            </a>
          </Link>
          {headerElements.map((a, index) => {
            return (
              <a
                key={index}
                href={a.link}
                className={` hidden lg:flex self-center px-4 py-1 transition-all duration-150 border rounded border-off-300/20 hover:bg-off-300 hover:text-gray-900 ${a.class}`}
              >
                {a.icon} <span className="hidden sm:block">{a.title}</span>
              </a>
            );
          })}
          <div className="flex w-12 h-12 my-auto ml-10 cursor-pointer md:hidden">
            <Menu
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="self-center justify-center fill-current lg:hidden"
            />
          </div>
          <nav
            className={`justify-center gap-4 md:hidden my-auto text-base text-center flex grow
            ${
              showMobileMenu
                ? 'absolute top-16 mx-auto flex-col left-0 right-0 bg-black/50 py-6'
                : 'hidden'
            }
          `}
          >
            <a
              href="https://staking.bibliothecadao.xyz/"
              className={`hover:text-gray-400`}
            >
              Staking
            </a>
            <Link href="/claim">
              <a className={`hover:text-gray-400`}>Claim</a>
            </Link>
            <a
              href="https://github.com/BibliothecaForAdventurers/"
              target={'_blank'}
              className={`hover:text-gray-400`}
              rel="noreferrer"
            >
              Github
            </a>
            <a
              href="https://discord.gg/uQnjZhZPfu"
              target={'_blank'}
              className={`hover:text-gray-400`}
              rel="noreferrer"
            >
              Discord
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};
