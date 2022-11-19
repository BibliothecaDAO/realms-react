import { OrderIcon, Tabs, Button, Card } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import Scroll from '@bibliotheca-dao/ui-lib/icons/scroll-svgrepo-com.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/sword.svg';
import { HeartIcon } from '@heroicons/react/20/solid';
import { useAccount } from '@starknet-react/core';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
} from 'react';
import { useAccount as useL1Account } from 'wagmi';
import {
  RealmHistory,
  RealmOverview,
  Travel,
  RealmLore,
  RealmsFood,
  RealmsArmy,
} from '@/components/panels/Realms/details';
import { RealmImage } from '@/components/panels/Realms/details/Image';
import { RealmResources } from '@/components/tables/RealmResources';
import { useRealmContext } from '@/context/RealmContext';
import type { GetRealmQuery, Realm } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import useFood from '@/hooks/settling/useFood';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
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
    const { address: l1Address } = useL1Account();
    const { address, status } = useAccount();
    const {
      state: { favouriteRealms },
      actions,
    } = useRealmContext();

    const ensData = useEnsResolver(props.realm?.owner as string);

    const {
      buildings,
      buildingUtilisation,
      loading: loadingBuildings,
    } = useBuildings(props.realm as Realm);

    const {
      realmFoodDetails,
      availableFood,
      loading: loadingFood,
    } = useFood(props.realm as Realm);

    const tabs = useMemo(
      () => [
        {
          label: <Castle className="self-center w-4 h-4 fill-current" />,
          component: (
            <RealmOverview
              availableFood={availableFood}
              realmFoodDetails={realmFoodDetails}
              {...props}
            />
          ),
        },
        // {
        //   label: <Castle className="self-center w-5 h-5 fill-current" />,
        //   component: (
        //     <RealmResources
        //       showRaidable
        //       showClaimable
        //       realm={props.realm}
        //       loading={props.loading}
        //     />
        //   ),
        // },
        {
          label: <Sword className="self-center w-4 h-4 fill-current" />,
          component: <RealmsArmy buildings={buildings} realm={props.realm} />,
        },
        {
          label: <Sickle className="self-center w-4 h-4  fill-current" />,
          component: (
            <RealmsFood
              realmFoodDetails={realmFoodDetails}
              availableFood={availableFood}
              buildings={buildings}
              realm={props.realm}
              loading={false}
            />
          ),
        },
        {
          label: <Globe className="self-center w-4 h-4 fill-current" />,
          component: <Travel realm={props.realm} />,
        },
        {
          label: <Scroll className="self-center w-4 h-4  fill-current" />,
          component: <RealmHistory realmId={props.realm.realmId} />,
        },
        {
          label: <Library className="self-center w-4 h-4  fill-current" />,
          component: (
            <RealmLore
              realmName={props.realm.name || ''}
              realmId={props.realm.realmId || 0}
            />
          ),
        },
      ],
      [availableFood, buildings, realmFoodDetails, props]
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

    const { starknetId } = useStarkNetId(RealmOwner(props.realm) || '');

    return (
      <Card ref={ref}>
        {props.realm?.wonder && (
          <div className="w-full p-2 mb-2 text-2xl font-semibold text-center uppercase rounded shadow-inner bg-gray-1000 tracking-veryWide">
            {props.realm?.wonder}
          </div>
        )}

        <div className="flex pb-2">
          {/* <RealmImage id={props.realm.realmId} /> */}
          <div>
            <div className="self-center flex ">
              <OrderIcon
                size="sm"
                order={props.realm.orderType.toLowerCase()}
              />
              <h3 className="text-center self-center ml-2">
                {props.realm.name}{' '}
              </h3>
            </div>
            <div className="flex">
              <div className="flex">
                {!isFavourite(props.realm, favouriteRealms) && (
                  <Button
                    size="xs"
                    variant="unstyled"
                    onClick={() =>
                      actions.addFavouriteRealm(props.realm.realmId)
                    }
                  >
                    <HeartIcon className="w-5 fill-black stroke-white/50 hover:fill-current" />
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
                    <HeartIcon className="w-5" />
                  </Button>
                )}
              </div>
              <span className=" ml-2 self-center">{props.realm.realmId}</span>
            </div>
          </div>

          <div className=" text-lg justify-center ml-auto">
            <div className="text-right">
              {starknetId ?? starknetId}
              {!starknetId && shortenAddressWidth(RealmOwner(props.realm), 6)}
              {!starknetId &&
                isYourRealm(props.realm, l1Address, address || '') &&
                isYourRealm(props.realm, l1Address, address || '')}
            </div>{' '}
            <div className="flex justify-end">
              <span className="mr-3">{props.realm.relicsOwned?.length}</span>{' '}
              <Relic className={` w-3 fill-yellow-500`} />{' '}
            </div>
          </div>
          {/* {props.realm.owner && (
            <h3 className="self-center my-2 ml-auto">{ensData.displayName}</h3>
          )} */}
        </div>
        {/* <div className="my-2 w-full flex">
          <Button size="xs" variant="primary" className="w-full">
            raid - 4 days of vault
          </Button>
        </div> */}

        {/* <h6>{RealmStatus(props.realm)}</h6> */}
        <Tabs
          selectedIndex={selectedTab}
          onChange={(index) => pressedTab(index as number)}
          variant="small"
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
