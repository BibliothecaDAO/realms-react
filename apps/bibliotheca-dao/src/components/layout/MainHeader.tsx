import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/BibliothecaBook.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import Discord from '@bibliotheca-dao/ui-lib/icons/social/discord.svg';
import Github from '@bibliotheca-dao/ui-lib/icons/social/github.svg';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { useState } from 'react';

import { links } from '@/data/Projects';
import { useWalletContext } from '@/hooks/useWalletContext';
import { Head } from './Head';

export const MainHeader = () => {
  const { lordsPrice } = useWalletContext();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const headerElements = [
    // {
    //   title: 'Articles',
    //   icon: '',
    //   link: '/articles',
    //   class: ' hidden sm:block',
    // },
    {
      title: '',
      icon: <Discord className="self-center w-6 fill-current" />,
      link: links[0].discord,
    },
    {
      title: '',
      icon: <Github className="self-center w-6 fill-current" />,
      link: links[0].github,
    },
  ];
  return (
    <div className="fixed z-50 flex w-full h-16 px-4 space-x-8 tracking-widest uppercase border-b sm:px-10 bg-gray-900/40 border-white/30">
      <Head />
      <div className="container flex justify-between mx-auto text-white">
        <Link href="/" className="self-center">
          <BibliothecaBook className="mr-10 transition-all duration-150 cursor-pointer fill-current h-9 hover:fill-white" />
        </Link>

        <Link
          href="/treasury"
          className="self-center hidden px-4 py-1 mr-auto transition-all duration-150 border rounded sm:flex border-off-300/20 hover:bg-off-300 hover:text-gray-900"
        >
          <span className="hidden sm:block">DAO | </span> ${lordsPrice}{' '}
          <Lords className="self-center h-4 ml-4 fill-current" />
        </Link>

        <div className="flex py-2 sm:space-x-4">
          <ConnectKitButton.Custom>
            {({ show, isConnected, truncatedAddress, ensName }) => {
              return (
                <>
                  <button
                    className="flex self-center px-4 py-1 mr-auto transition-all duration-150 border rounded border-off-300/20 hover:bg-off-300 hover:text-gray-900"
                    onClick={show}
                  >
                    {isConnected ? (
                      ensName ?? truncatedAddress
                    ) : (
                      <span className="uppercase">Connect Wallet</span>
                    )}
                  </button>
                </>
              );
            }}
          </ConnectKitButton.Custom>

          {/* <Link
            href="/articles"
            className="self-center hidden px-4 py-1 mr-auto transition-all duration-150 border rounded md:flex border-off-300/20 hover:bg-off-300 hover:text-gray-900"
          >
            Articles
          </Link> */}
          {headerElements.map((a, index) => {
            return (
              <a
                key={index}
                href={a.link}
                className={` hidden lg:flex self-center px-4 py-1 transition-all duration-150 border rounded border-off-300/20 hover:bg-off-300 hover:text-gray-900 h-full `}
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
            <Link className={`hover:text-gray-400`} href="/hack">
              Hack
            </Link>
            <a
              href="https://staking.bibliothecadao.xyz/"
              className={`hover:text-gray-400`}
            >
              Staking
            </a>
            <Link href="/claim" className={`hover:text-gray-400`}>
              Claim
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
