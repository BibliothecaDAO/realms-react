import { useStarknet, ConnectorNotFoundError } from '@starknet-react/core';
import { useState, useEffect } from 'react';
import { ScrollSpy } from '@/util/ScrollSpy';
// Abstracted from ScrollSpy to allow for easier customizations
const onScrollUpdate = (entry: any, isInVewPort: any) => {
  const { target, boundingClientRect } = entry;
  const menuItem = document.querySelector(`[data-scrollspy-id="${target.id}"]`);
  if (boundingClientRect.y <= 0 && isInVewPort) {
    menuItem?.classList.add('font-semibold', 'text-white');
  } else {
    if (menuItem?.classList.contains('font-semibold')) {
      menuItem.classList.remove('font-semibold');
      menuItem.classList.remove('text-white');
    }
  }
};

const NavMenu = ({ options }: any) => {
  // control the click event
  const onClick = (e: any) => {
    e.preventDefault();
    // Set the hash
    window.location.hash = e.target.hash;

    // Scroll to the section + 1 to account for weird bug.
    // remove the `+1` and click on Section 2 link to see the bug.
    const targetSection: HTMLElement | null = document.querySelector(
      `${e.target.hash}`
    );
    if (targetSection) {
      window.scrollTo(0, targetSection.offsetTop + 1);
    }
  };

  return (
    <nav className="pt-8 pr-8 text-xl tracking-widest uppercase sm:block">
      <ul>
        {options.map((option: any) => (
          <li className="my-2" key={option.hash}>
            <a
              href={`#${option.hash}`}
              onClick={onClick}
              data-scrollspy-id={option.hash}
              className={`hover:font-semibold`}
            >
              {option.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export const WithNavMenu = ({ children, selector }: any) => {
  const {
    account,
    error,
    connect,
    connectors,
    error: starknetConnectionError,
  } = useStarknet();
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

  return (
    <div className="flex">
      <ScrollSpy handleScroll={onScrollUpdate} />
      <div className="relative pr-14">
        <div className="sticky top-0 hidden sm:block">
          <NavMenu options={options} />
          <div className="pt-8 pb-16">
            {account ? (
              <a
                target={'_blank'}
                href={`https://docs.google.com/forms/d/e/1FAIpQLSc66txDM8Ei3w83p3kLJL30VoBS6P7Xep4cIDVACZAbLY05mg/viewform?usp=pp_url&entry.2005620554=${account}`}
                className="border px-4 py-2 rounded w-full bg-[#eb5600] hover:bg-[#c94a00] font-display"
                rel="noreferrer"
              >
                Get briqs & buidl
              </a>
            ) : (
              <div className="w-48">
                {!account && !error && (
                  <button
                    className="border px-4 py-2 rounded w-full bg-[#eb5600] hover:bg-[#c94a00]  font-body uppercase"
                    onClick={() => {
                      connect(connectors[0]);
                    }}
                  >
                    Connect to ArgentX
                  </button>
                )}
                {error instanceof ConnectorNotFoundError && (
                  <div className="p-4 text-red-800 bg-red-100 border-red-700 rounded-md">
                    The ArgentX wallet extension could not be activated. Please{' '}
                    <a
                      rel="noreferrer"
                      target="_blank"
                      className="underline"
                      href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                    >
                      install ArgentX
                    </a>{' '}
                    on a supported browser and revisit this page.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};
