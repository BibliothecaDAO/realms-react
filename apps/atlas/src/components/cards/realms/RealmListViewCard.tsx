import { Button, OrderIcon, Tabs } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import { HeartIcon } from '@heroicons/react/20/solid';
import { useStarknet } from '@starknet-react/core';
import { useRouter } from 'next/router';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import { TroopSlot } from '@/constants/troops';
import { useAtlasContext } from '@/context/AtlasContext';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { useWalletContext } from '@/hooks/useWalletContext';
import {
  getAccountHex,
  hasOwnRelic,
  RealmCombatStatus,
  RealmStatus,
  trimmedOrder,
} from '@/shared/Getters/Realm';
import SquadStatistics from '@/shared/squad/SquadStatistics';
import { shortenAddressWidth } from '@/util/formatters';
import { findResourceName } from '@/util/resources';

interface RealmOverviewsProps {
  realm: RealmFragmentFragment;
  isYourRealms?: boolean;
}

export const RealmListCardView = forwardRef<any, RealmOverviewsProps>(
  (props: RealmOverviewsProps, ref) => {
    const { play } = useUiSounds(soundSelector.pageTurn);

    const router = useRouter();
    const { account } = useWalletContext();
    const { account: starkAccount } = useStarknet();
    const {
      mapContext: { navigateToAsset },
    } = useAtlasContext();
    const {
      state: { favouriteRealms },
      actions,
    } = useRealmContext();

    const isYourRealm = (realm: RealmFragmentFragment) =>
      (account &&
        (account.toLowerCase() === realm.owner ||
          account.toLowerCase() === realm.bridgedOwner)) ||
      (starkAccount &&
        (starkAccount.toLowerCase() === realm.ownerL2 ||
          starkAccount.toLowerCase() === realm.settledOwner));

    const isFavourite = (realm: RealmFragmentFragment) =>
      favouriteRealms.indexOf(realm.realmId) > -1;
    const [selectedTab, setSelectedTab] = useState(0);
    const getRealmOwner = (realm: RealmFragmentFragment) =>
      realm.settledOwner ||
      realm.bridgedOwner ||
      realm.owner ||
      realm.ownerL2 ||
      '';

    useImperativeHandle(ref, () => ({
      selectTab(index) {
        setSelectedTab(index);
      },
    }));

    const tabs = useMemo(
      () => [
        {
          label: <Castle className="self-center w-6 h-6 fill-current" />,
          component: (
            <div className="w-full p-1">
              <RealmResources
                showRaidable
                realm={props.realm}
                loading={false}
              />
            </div>
          ),
        },
        /* {
          label: <Helm className="self-center w-6 h-6 fill-current" />,
          component: (
            <div>
              <h3 className="mb-1">Defending Army</h3>
              <div className="self-center w-full font-semibold tracking-widest uppercase opacity-80">
                <SquadStatistics
                  className="pl-4"
                  troops={props.realm.troops || []}
                  slot={TroopSlot.defending}
                />
              </div>
              <h3 className="mt-4 mb-1">Attacking Army</h3>
              <div className="self-center w-full font-semibold tracking-widest uppercase opacity-80">
                <SquadStatistics
                  className="pl-4"
                  troops={props.realm.troops || []}
                  slot={TroopSlot.attacking}
                />
              </div>
            </div>
          ),
        },
        {
          label: <Sickle className="self-center w-6 h-6 fill-current" />,
          component: <div className="w-full p-1"></div>,
        }, */
      ],
      [selectedTab]
    );

    const pressedTab = (index) => {
      play();
      setSelectedTab(index as number);
    };

    return (
      <div
        ref={ref}
        className={`h-auto max-w-full col-span-12 sm:col-span-6 md:col-span-4 p-6 bg-black/90 border-4 border-double border-white/10  justify-evenly flex flex-col hover:shadow-sm shadow-lg rounded-xl  transition-all duration-450 transform hover:-translate-y-1 hover:border-yellow-200/40 rounded-t-3xl hover:shadow-order-${trimmedOrder(
          props.realm
        )}`}
      >
        {props.realm?.wonder && (
          <div className="w-full p-2 text-xl font-semibold text-center uppercase shadow-inner tracking-veryWide bg-black/90">
            {props.realm?.wonder}
          </div>
        )}
        <div className="flex items-center justify-center w-full pb-4 mb-4 border-b-4 border-double border-white/20">
          <OrderIcon
            withTooltip
            className="self-center mr-3"
            size={'lg'}
            order={props.realm.orderType.toLowerCase()}
          />
          <h2 className="self-center ">
            {props.realm.name}
            {'   '}
            <span className="opacity-30"> #{props.realm.realmId}</span>
          </h2>
          {!isYourRealm(props.realm) && (
            <Tooltip
              className="ml-3"
              tooltipText={
                'Lord: ' + shortenAddressWidth(getRealmOwner(props.realm), 6)
              }
            >
              <Crown className="w-8 fill-white" />
            </Tooltip>
          )}
          <div className="flex items-center self-center px-3">
            {!isFavourite(props.realm) && (
              <Button
                size="xs"
                variant="unstyled"
                onClick={() => actions.addFavouriteRealm(props.realm.realmId)}
              >
                <HeartIcon className="w-6 fill-black stroke-white/20 hover:fill-current" />
              </Button>
            )}{' '}
            {isFavourite(props.realm) && (
              <Button
                size="xs"
                variant="unstyled"
                className="w-full"
                onClick={() =>
                  actions.removeFavouriteRealm(props.realm.realmId)
                }
              >
                <HeartIcon className="w-6" />
              </Button>
            )}
          </div>
        </div>
        {/* <div className="flex justify-center w-full text-center uppercase font-display">
          <span className="self-center">
            {props.realm && RealmCombatStatus(props.realm)}
          </span>

          <Relic
            className={`ml-4 w-5 ${
              hasOwnRelic(props.realm) ? 'fill-yellow-500' : 'fill-red-600'
            }`}
          />
          </div> */}
        <Tabs
          selectedIndex={selectedTab}
          onChange={(index) => pressedTab(index as number)}
          variant="default"
        >
          <Tabs.List className="">
            {tabs.map((tab, index) => (
              <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panels>
            {tabs.map((tab, index) => (
              <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
            ))}
          </Tabs.Panels>
        </Tabs>
        {/* <h4 className="self-center hidden p-1 px-4 mx-auto text-xs text-gray-400 border border-gray-400 rounded sm:block">
                rank: {realm.rarityRank}
              </h4> */}
        {/* <h4 className="self-center hidden p-1 px-4 mx-auto text-xs sm:block">
                {RealmStatus(realm)}
              </h4> */}

        <div className="w-full pt-4 mt-auto bg-black shadow-inner">
          <div className="flex w-full mt-auto space-x-2">
            {' '}
            {isYourRealm(props.realm) && (
              <div>
                {RealmStatus(props.realm) === 'Layer 1' && (
                  <Button
                    size="xs"
                    variant="secondary"
                    className="w-full uppercase"
                    onClick={() => {
                      // TODO: Re-enable
                      // toggleMenuType('bridgeRealms');
                    }}
                  >
                    Bridge Realm
                  </Button>
                )}
                {RealmStatus(props.realm) === 'Unsettled L2' && (
                  <Button
                    size="xs"
                    variant="secondary"
                    className="w-full uppercase"
                    onClick={() => {
                      // TODO: Re-enable
                      // toggleMenuType('settleRealms');
                    }}
                  >
                    Settle Realm
                  </Button>
                )}
              </div>
            )}
            <div className="w-full">
              <Button
                onClick={() => {
                  router.push(
                    `/realm/${props.realm.realmId}?tab=Survey`,
                    undefined,
                    { shallow: true }
                  );
                }}
                variant="primary"
                size="xs"
                className="w-full"
              >
                {isYourRealm(props.realm) ? 'manage' : 'details'}
              </Button>
            </div>
            {/* <Button
            onClick={() => openRealmDetails(props.realm.realmId)}
            variant="outline"
            size="xs"
          >
            quick
          </Button> */}
            <div className="flex self-center space-x-2">
              <div>
                <Button
                  onClick={() => {
                    navigateToAsset(props.realm.realmId, 'realm');
                  }}
                  variant="outline"
                  size="xs"
                  className="w-full uppercase"
                >
                  fly
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RealmListCardView.displayName = 'RealmListCardView';
