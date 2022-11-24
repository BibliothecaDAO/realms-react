import useCountdown from '@bibliotheca-dao/core-lib/hooks/use-countdown';
import { OrderIcon, Tabs, Button, Card } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import Scroll from '@bibliotheca-dao/ui-lib/icons/scroll-svgrepo-com.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/sword.svg';
import { Disclosure } from '@headlessui/react';
import { HeartIcon, ChevronDoubleDownIcon } from '@heroicons/react/20/solid';
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
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { CombatSideBar } from '@/components/sidebars/CombatSideBar';
import { RealmResources } from '@/components/tables/RealmResources';
import { useAtlasContext } from '@/context/AtlasContext';
import { useModalContext } from '@/context/ModalContext';
import { useRealmContext } from '@/context/RealmContext';
import type { GetRealmQuery, Realm } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import useFood from '@/hooks/settling/useFood';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import useIsOwner from '@/hooks/useIsOwner';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import {
  hasOwnRelic,
  isFavourite,
  IsSettled,
  isYourRealm,
  RealmCombatStatus,
  RealmOwner,
  RealmStatus,
} from '@/shared/Getters/Realm';
import SidebarHeader from '@/shared/SidebarHeader';
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
              buildingUtilisation={buildingUtilisation}
              availableFood={availableFood}
              realmFoodDetails={realmFoodDetails}
              {...props}
            />
          ),
        },

        {
          label: <Sword className="self-center w-4 h-4 fill-current" />,
          component: <RealmsArmy buildings={buildings} realm={props.realm} />,
        },
        {
          label: <Sickle className="self-center w-4 h-4 fill-current" />,
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
          label: <Scroll className="self-center w-4 h-4 fill-current" />,
          component: <RealmHistory realmId={props.realm.realmId} />,
        },
        {
          label: <Library className="self-center w-4 h-4 fill-current" />,
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
    const { userData, userRealms } = useUsersRealms();
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
    const vaultCooldownMinutes = 30;
    const attackingCooldownMinutes = 10;

    const time = (timestamp: any, minutes: number) => {
      const cooldownSeconds = 60 * minutes;
      const t = timestamp ? new Date(parseInt(timestamp)).getTime() : 0;
      return (t + cooldownSeconds).toString();
    };

    const vaultCountdown = useCountdown({
      date: time(props.realm?.lastAttacked, vaultCooldownMinutes),
    });

    const userArmiesAtLocation = userData.attackingArmies?.filter(
      (army) => army.destinationRealmId == props.realm.realmId
    );

    const [isRaiding, setIsRaiding] = useState(false);
    const [isTravel, setIsTravel] = useState(false);

    const isOwner = useIsOwner(props?.realm?.settledOwner);

    const {
      mapContext: { navigateToAsset },
    } = useAtlasContext();
    const { openModal } = useModalContext();

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
            <div className="flex self-center ">
              <OrderIcon
                size="sm"
                order={props.realm.orderType.toLowerCase()}
              />
              <h3 className="flex self-center ml-2 text-center">
                {props.realm.name}{' '}
              </h3>
            </div>
            <div className="flex mt-1">
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
              <div className="self-center ml-2">
                <Button
                  onClick={() => {
                    navigateToAsset(props.realm.realmId, 'realm');
                    actions.updateSearchIdFilter(
                      props.realm.realmId ? props.realm.realmId.toString() : '0'
                    );
                  }}
                  variant="outline"
                  size="xs"
                >
                  fly
                </Button>
              </div>
              <span className="self-center ml-2 text-lg ">
                {props.realm.realmId}
              </span>
            </div>
          </div>

          <div className="justify-center ml-auto text-lg ">
            <div className="text-right">
              {starknetId ?? starknetId}
              {!starknetId && shortenAddressWidth(RealmOwner(props.realm), 6)}
              {!starknetId &&
                isYourRealm(props.realm, l1Address, address || '') &&
                isYourRealm(props.realm, l1Address, address || '')}
            </div>{' '}
            <div className="flex justify-end">
              <span
                className={`self-center mr-2 text-xs  uppercase ${
                  hasOwnRelic(props.realm) ? 'text-green-700' : 'text-red-400'
                }`}
              >
                {hasOwnRelic(props.realm) ? 'free realm' : 'annexed'}
              </span>
              <span className="mr-3">{props.realm.relicsOwned?.length}</span>{' '}
              <Relic className={`w-3 fill-yellow-500`} />{' '}
            </div>
          </div>
        </div>
        {!isOwner && IsSettled(props.realm) ? (
          <div className="w-full my-2">
            <Button
              onClick={() => {
                userArmiesAtLocation && userArmiesAtLocation.length
                  ? setIsRaiding(true)
                  : setIsTravel(true);
              }}
              size="md"
              className="w-full"
              disabled={!vaultCountdown.expired}
              variant={'primary'}
            >
              {props.realm && RealmCombatStatus(props.realm)}
            </Button>
          </div>
        ) : (
          RealmStatus(props.realm)
        )}

        <AtlasSidebar containerClassName="w-full" isOpen={isRaiding}>
          <SidebarHeader onClose={() => setIsRaiding(false)} />
          <CombatSideBar defendingRealm={props.realm} />
        </AtlasSidebar>
        <AtlasSidebar containerClassName="w-full md:w-5/12" isOpen={isTravel}>
          <SidebarHeader
            title={'Travel to Realm ' + props.realm.realmId}
            onClose={() => setIsTravel(false)}
          />
          <Travel realm={props.realm} />
        </AtlasSidebar>
        {IsSettled(props.realm) && (
          <>
            {isOwner && (
              <Button
                onClick={() => {
                  openModal('realm-build', {
                    realm: props.realm,
                    buildings: buildings,
                  });
                }}
                variant="primary"
              >
                build
              </Button>
            )}
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-1 mb-2 border rounded border-white/20 hover:bg-gray-900">
                    <ChevronDoubleDownIcon
                      className={`w-5 h-5 mx-auto ${
                        open ? 'rotate-180 transform' : ''
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-gray-500">
                    {open && (
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
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </>
        )}
      </Card>
    );
  }
);

RealmCard.displayName = 'RealmCard';
