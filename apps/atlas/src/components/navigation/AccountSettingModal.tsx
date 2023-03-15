import { Button, Checkbox, Tabs } from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown_icon.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import { useAccount } from '@starknet-react/core';
import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { sidebarClassNames } from '@/constants/ui';
import { useSoundContext } from '@/context/soundProvider';
import { useUIContext } from '@/context/UIContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import useScreenOrientation from '@/hooks/useScreenOrientation';
import { shortenAddress } from '@/util/formatters';
import AtlasSideBar from '../map/AtlasSideBar';
import { RangeSliderFilter } from '../ui/filters/RangeSliderFilter';
import NetworkConnectButton from '../ui/NetworkConnectButton';

type AccountSettingsModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const AccountSettingsModal = ({
  isOpen,
  onClose,
}: AccountSettingsModalProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const pressedTab = (index) => {
    // play();
    setSelectedTab(index as number);
  };
  const tabs = useMemo(
    () => [
      {
        label: (
          <div className="flex">
            <Crown className="self-center w-6 h-6 fill-current md:mr-2" />{' '}
            <div className="hidden md:block">Wallet</div>
          </div>
        ),
        component: <Wallet />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Helm className="self-center w-6 h-6 fill-current md:mr-2" />{' '}
            <div className="hidden md:block">Settings</div>
          </div>
        ),
        component: <Settings />,
      },
    ],
    []
  );

  return (
    <AtlasSideBar
      isOpen={isOpen}
      containerClassName={twMerge(
        sidebarClassNames,
        'z-30 lg:mx-auto lg:left-0 lg:!right-0 lg:!left-0'
      )}
      onClose={onClose}
    >
      {isOpen && (
        <div className="flex-col w-full overflow-y-scroll text-center">
          <img
            alt="Ouroboros Eternum Logo"
            src="/eternum-logo_animated.png"
            className="w-20 mx-auto"
            style={{
              filter:
                'invert(90%) sepia(17%) saturate(688%) hue-rotate(331deg) brightness(109%) contrast(99%)',
            }}
          />
          <h1 className="mb-8">Eternum</h1>
          <Tabs
            selectedIndex={selectedTab}
            onChange={(index) => pressedTab(index as number)}
            variant="primary"
          >
            <div className="sticky top-0 p-4 overflow-x-auto text-sm bg-gradient-to-r from-gray-900 to-gray-1000">
              <Tabs.List className="py-0">
                {tabs.map((tab, index) => (
                  <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
                ))}
              </Tabs.List>
            </div>
            <div className="px-6 pb-6 mt-2">
              <Tabs.Panels>
                {tabs.map((tab, index) => (
                  <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
                ))}
              </Tabs.Panels>
            </div>
          </Tabs>
        </div>
      )}
    </AtlasSideBar>
  );
};

export const Wallet = () => {
  const { address, status, connector } = useAccount();
  const { toggleSound } = useSoundContext();
  const { userRealms } = useUserBalancesContext();
  const { toggleSplash, toggleAccountSettings } = useUIContext();

  return (
    <>
      {address && status === 'connected' ? (
        <div>
          {/* <div className="flex">
            <h2 className="pb-4 text-left">Your Realms</h2>
            <h3 className="ml-8 leading-10 text-gray-600">
              {shortenAddress(address)}
            </h3>
          </div> */}
          {/* <div className="grid grid-cols-6 gap-2">
            {userRealms &&
              userRealms.realms.map((realm) => {
                return (
                  <div
                    className="h-24 border-2 border-yellow-800/40"
                    key={realm.realmId}
                  >
                    {realm.name}
                  </div>
                );
              })}
          </div> */}
          <div className="flex w-full gap-4 mt-8">
            <Button
              className="mx-auto md:w-1/2"
              variant="primary"
              onClick={() => {
                toggleSplash();
                toggleSound();
              }}
            >
              Launch
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded bg-gray-1000">
          <NetworkConnectButton />
        </div>
      )}
    </>
  );
};

export const Settings = () => {
  const { toggleFullScreen, isFullScreen } = useScreenOrientation();
  const {
    musicVolume,
    onMusicVolumeChange,
    effectsVolume,
    onEffectsVolumeChange,
  } = useSoundContext();

  const [fullScreen, setFullScreen] = useState<boolean>(isFullScreen());

  const clickFullScreen = () => {
    setFullScreen(!fullScreen);
    toggleFullScreen();
  };
  return (
    <div>
      <div className="flex flex-col w-full gap-8 px-4">
        <div>
          <h4 className="text-left">Screen</h4>
          <hr className="mb-4" />
          <Checkbox
            onChange={clickFullScreen}
            checked={fullScreen}
            label="Fullscreen"
          />
        </div>
        <div>
          <h4 className="text-left">Sound</h4>
          <hr className="mb-4" />
          <RangeSliderFilter
            name="Music Volume"
            min={0}
            max={100}
            defaultValues={[100]}
            values={[musicVolume]}
            onChange={onMusicVolumeChange}
          />
          <RangeSliderFilter
            name="Effects Volume"
            min={0}
            max={100}
            defaultValues={[100]}
            values={[effectsVolume]}
            onChange={onEffectsVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};
