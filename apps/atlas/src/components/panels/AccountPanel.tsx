import { Tabs } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import { animated, useSpring } from '@react-spring/web';
import { useStarknet } from '@starknet-react/core';
import Image from 'next/future/image';
import { useState, useMemo } from 'react';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { getAccountHex } from '@/shared/Getters/Realm';
import { shortenAddressWidth } from '@/util/formatters';
import { SettleRealmsSideBar } from '../sidebars/SettleRealmsSideBar';
import { MyCrypts } from './Account/MyCrypts';
import { MyLoot } from './Account/MyLoot';
import { MyRealms } from './Account/MyRealms';
import { AccountOverview } from './Account/Overview';
import { BasePanel } from './BasePanel';

export function AccountPanel() {
  const { play } = useUiSounds(soundSelector.pageTurn);
  const { account } = useStarknet();
  const [isSettleRealmsSideBarOpen, setIsSettleRealmsSideBarOpen] =
    useState(false);

  const filter = {
    OR: [
      { ownerL2: { equals: getAccountHex(account || '0x0') } },
      { settledOwner: { equals: getAccountHex(account || '0x0') } },
    ],
  };
  const { data: realmsData } = useGetRealmsQuery({ variables: { filter } });
  const realmIds = realmsData?.realms?.map((realm) => realm.realmId) ?? [];

  const animation = useSpring({
    // opacity: true === 'account' ? 1 : 0,
    // transform: true === 'account' ? `translateY(0)` : `translateY(-20%)`,
    // delay: 150,
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = useMemo(
    () => [
      {
        label: (
          <div className="flex">
            <Crown className="self-center w-6 h-6 fill-current sm:mr-4" />{' '}
            <div className="hidden sm:block">Empire</div>
          </div>
        ),
        component: <AccountOverview />,
      },
      {
        label: (
          <div className="flex">
            <Castle className="self-center w-6 h-6 fill-current sm:mr-4" />{' '}
            <div className="hidden sm:block">My Realms</div>
          </div>
        ),
        component: <MyRealms />,
      },
      {
        label: (
          <div className="flex ">
            <Danger className="self-center w-6 h-6 fill-current sm:mr-4" />{' '}
            <div className="hidden sm:block">My Crypts</div>
          </div>
        ),
        component: <MyCrypts />,
      },
      {
        label: (
          <div className="flex no-wrap">
            <Bag className="self-center w-6 h-6 fill-current sm:mr-4" />{' '}
            <div className="hidden sm:block">My Loot</div>
          </div>
        ),
        component: <MyLoot />,
      },
    ],
    [selectedTab]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <BasePanel open={true}>
      <animated.div
        style={animation}
        className="w-full p-4 pt-10 border-b-4 shadow-xl sm:p-10 bg-black/60 border-black/40"
      >
        <div className="flex justify-start">
          <div className="relative hidden sm:block">
            <Image
              src={'/keyImage-tablet.png'}
              alt="map"
              height={300}
              width={300}
              className="w-24 h-24 mr-10 border-2 rounded-full shadow-2xl md:w-48 md:h-48 border-white/20"
            />
            <div className="absolute px-2 text-xl font-semibold border-2 rounded-full bg-black/80 border-white/70 bottom-10 right-10">
              1
            </div>
          </div>

          <div className="flex flex-wrap mt-10">
            <div className="self-center">
              {account && (
                <span className="self-center text-center sm:text-xl opacity-80">
                  {shortenAddressWidth(account, 6)}
                </span>
              )}
              <h2 className="w-full sm:text-5xl">Ser, Your Vast Empire</h2>
            </div>
          </div>
        </div>
      </animated.div>

      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="default"
      >
        <div className="w-full overflow-y-auto bg-black border-t border-white/20">
          <Tabs.List className="">
            {tabs.map((tab, index) => (
              <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
            ))}
          </Tabs.List>
        </div>
        <Tabs.Panels>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>

      <SettleRealmsSideBar
        isOpen={isSettleRealmsSideBarOpen}
        onClose={() => {
          setIsSettleRealmsSideBarOpen(false);
        }}
      />
    </BasePanel>
  );
}
