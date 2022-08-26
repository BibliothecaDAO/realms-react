import { Button } from '@bibliotheca-dao/ui-lib';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import Discord from '@bibliotheca-dao/ui-lib/icons/social/discord.svg';
import Github from '@bibliotheca-dao/ui-lib/icons/social/github.svg';
import Twitter from '@bibliotheca-dao/ui-lib/icons/social/twitter.svg';
import { useState, useEffect } from 'react';
import { ScrollSpy } from '@/util/ScrollSpy';

const NavMenu = ({ options }: any) => {
  // control the click event
  const onClick = (e: any) => {
    /*  e.preventDefault();
    // Set the hash
    window.location.hash = e.target.hash;

    // Scroll to the section + 1 to account for weird bug.
    // remove the `+1` and click on Section 2 link to see the bug.
    const targetSection: HTMLElement | null = document.querySelector(
      `${e.target.hash}`
    );
    if (targetSection) {
      window.scrollTo(0, targetSection.offsetTop + 1);
    } */
  };

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <header className="fixed top-0 z-10 w-full tracking-widest text-whitetext-xl bg-black/50 bg-blend-multiply backdrop-brightness-125 sm:block">
      <div className="flex justify-between w-full px-8">
        <span className="mt-1 text-5xl uppercase font-lords">
          R<span className="hidden lg:inline">ealms</span>
        </span>
        <nav
          className={`justify-center gap-4 lg:gap-8 my-auto text-base text-center flex lg:flex-row grow
            ${
              showMobileMenu
                ? 'absolute top-16 mx-auto flex-col left-0 right-0 bg-black/90 py-6'
                : 'hidden lg:flex'
            }
          `}
        >
          <a
            href="https://bibliothecadao.xyz/treasury"
            onClick={onClick}
            className={`hover:text-gray-400`}
          >
            The Treasury
          </a>
          <a
            href="https://snapshot.org/#/council.bibliotheca.eth"
            onClick={onClick}
            className={`hover:text-gray-400`}
          >
            Snapshot Voting
          </a>
          <a
            href="https://scroll.bibliothecadao.xyz/"
            onClick={onClick}
            className={`hover:text-gray-400`}
          >
            Master Scroll
          </a>
          <a
            href="https://staking.bibliothecadao.xyz/"
            onClick={onClick}
            className={`hover:text-gray-400`}
          >
            Staking
          </a>
        </nav>
        <div className="hidden mr-10 xl:mr-32 lg:flex">
          <a
            href="https://discord.gg/WpwYzsT8Jv"
            target="_blank"
            rel="noreferrer"
            className="self-center"
          >
            <Discord className="fill-current w-7 hover:animate-bounce sm:mr-4" />
          </a>
          <a
            href="https://github.com/BibliothecaForAdventurers"
            target="_blank"
            rel="noreferrer"
            className="self-center"
          >
            <Github className="fill-current w-7 hover:animate-bounce sm:mr-4" />
          </a>
          <a
            href="https://twitter.com/LootRealms"
            target="_blank"
            rel="noreferrer"
            className="self-center"
          >
            <Twitter className="w-6 fill-current hover:animate-bounce sm:mr-4" />
          </a>
        </div>
        <Button
          className="py-2 my-3 text-base font-normal tracking-wide text-white normal-case border border-black rounded-lg shadow-xl bg-white/50"
          href="https://atlas.bibliothecadao.xyz"
          variant="dao"
          target="_blank"
          texture={false}
        >
          Explore the Atlas
        </Button>
        <Menu
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="justify-center my-auto lg:hidden"
        />
      </div>
    </header>
  );
};

export const WithNavMenu = ({ children, selector }: any) => {
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    const navMenuSections = document.querySelectorAll(selector);
    const optionsFromSections = Array.from(navMenuSections).map((section) => {
      return {
        hash: section.id,
        title: section.dataset.navTitle,
      };
    });
    setOptions(optionsFromSections);
  }, [selector]);

  return <NavMenu options={options} />;
};
