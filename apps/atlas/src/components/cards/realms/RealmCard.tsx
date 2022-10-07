import { OrderIcon, Tabs, Button, Card } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Scroll from '@bibliotheca-dao/ui-lib/icons/scroll-svgrepo-com.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import { HeartIcon } from '@heroicons/react/20/solid';
import { useAccount } from '@starknet-react/core';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
} from 'react';
import {
  RealmHistory,
  RealmOverview,
  Travel,
  RealmLore,
} from '@/components/panels/Realms/details';
import { RealmResources } from '@/components/tables/RealmResources';
import { useRealmContext } from '@/context/RealmContext';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { useWalletContext } from '@/hooks/useWalletContext';
import {
  isFavourite,
  isYourRealm,
  RealmOwner,
  RealmStatus,
} from '@/shared/Getters/Realm';
import { shortenAddressWidth } from '@/util/formatters';
import type { RealmsCardProps } from '../../../types';

export const RealmCard = forwardRef<any, RealmsCardProps>(
  (props: RealmsCardProps, ref) => {
    const { play } = useUiSounds(soundSelector.pageTurn);
    const { account } = useWalletContext();
    const { address, status } = useAccount();
    const {
      state: { favouriteRealms },
      actions,
    } = useRealmContext();
    const ensData = useEnsResolver(props.realm?.owner as string);

    const tabs = useMemo(
      () => [
        {
          label: <Castle className="self-center w-6 h-6 fill-current" />,
          component: <RealmOverview {...props} />,
        },
        {
          label: <Sickle className="self-center w-6 h-6 fill-current" />,
          component: (
            <RealmResources
              showRaidable
              showClaimable
              realm={props.realm}
              loading={props.loading}
            />
          ),
        },
        {
          label: <Globe className="self-center w-6 h-6 fill-current" />,
          component: <Travel realm={props.realm} />,
        },
        {
          label: <Scroll className="self-center w-6 h-6 fill-current" />,
          component: <RealmHistory realmId={props.realm.realmId} />,
        },
        {
          label: <Library className="self-center w-6 h-6 fill-current" />,
          component: (
            <RealmLore
              realmName={props.realm.name || ''}
              realmId={props.realm.realmId || 0}
            />
          ),
        },
      ],
      [props.realm?.realmId]
    );

    const [selectedTab, setSelectedTab] = useState(0);

    useImperativeHandle(ref, () => ({
      selectTab(index) {
        setSelectedTab(index);
      },
    }));

    const pressedTab = (index) => {
      play();
      setSelectedTab(index as number);
    };

    return (
      <Card ref={ref}>
        {props.realm?.wonder && (
          <div className="w-full p-2 mb-2 text-2xl font-semibold text-center uppercase rounded shadow-inner bg-gray-1000 tracking-veryWide">
            {props.realm?.wonder}
          </div>
        )}
        <div className="flex justify-between">
          <h4 className="flex">
            <Crown className="self-center w-5 h-5 mr-4 fill-white" />{' '}
            {isYourRealm(props.realm, account, address || '')
              ? 'ser'
              : shortenAddressWidth(RealmOwner(props.realm), 6)}
          </h4>
          <div className="flex items-center self-center">
            {!isFavourite(props.realm, favouriteRealms) && (
              <Button
                size="xs"
                variant="unstyled"
                onClick={() => actions.addFavouriteRealm(props.realm.realmId)}
              >
                <HeartIcon className="w-6 fill-black stroke-white/50 hover:fill-current" />
              </Button>
            )}{' '}
            {isFavourite(props.realm, favouriteRealms) && (
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
        <div className="flex justify-between pt-4">
          <h2>
            <span className="opacity-50">{props.realm.realmId}</span> |{' '}
            {props.realm.name}{' '}
          </h2>
          {props.realm.owner && (
            <h3 className="self-center my-2 ml-auto">{ensData.displayName}</h3>
          )}
          <div className="self-center">
            <OrderIcon size="md" order={props.realm.orderType.toLowerCase()} />
          </div>
        </div>

        <hr className="mt-3 border border-white/30" />
        {/* <h6>{RealmStatus(props.realm)}</h6> */}
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
      </Card>
    );
  }
);

RealmCard.displayName = 'RealmCard';
