import { Button, OrderIcon, ResourceIcon, Tabs } from '@bibliotheca-dao/ui-lib';
import { useStarknet } from '@starknet-react/core';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import { TroopSlot } from '@/constants/troops';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { RealmStatus, squadStats, trimmedOrder } from '@/shared/Getters/Realm';
import SquadStatistics from '@/shared/squad/SquadStatistics';
import { findResourceName } from '@/util/resources';

interface RealmOverviewsProps {
  realm: RealmFragmentFragment;
  isYourRealms?: boolean;
}

const JOURNEY_1_ADDRESS = '0x17963290db8c30552d0cfa2a6453ff20a28c31a2';
const JOURNEY_2_ADDRESS = '0xcdfe3d7ebfa793675426f150e928cd395469ca53';

export function RealmListCardView(props: RealmOverviewsProps) {
  const router = useRouter();
  const { account } = useWalletContext();
  const { account: starkAccount } = useStarknet();
  const {
    openDetails,
    toggleMenuType,
    selectedMenuType,
    gotoAssetId,
    togglePanelType,
  } = useAtlasContext();
  const {
    state: { favouriteRealms },
    actions,
  } = useRealmContext();

  const isBridgedViaGalleon = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_1_ADDRESS;
  const isBridgedViaCarrack = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_2_ADDRESS;

  const isYourRealm = (realm: RealmFragmentFragment) =>
    (account &&
      (account.toLowerCase() === realm.owner ||
        account.toLowerCase() === realm.bridgedOwner)) ||
    (starkAccount &&
      (starkAccount.toLowerCase() === realm.ownerL2 ||
        starkAccount.toLowerCase() === realm.settledOwner));

  const openRealmDetails = (realmId: number) => {
    openDetails('realm', realmId.toString());
    if (selectedMenuType !== 'realm') {
      toggleMenuType('realm');
    }
  };

  const isFavourite = (realm: RealmFragmentFragment) =>
    favouriteRealms.indexOf(realm.realmId) > -1;
  let bridgeRow;

  if (props.isYourRealms) {
    bridgeRow = (
      <div className={`justify-between mb-3`}>
        <div className="flex">
          You have X Realms on L1 (Ethereum)
          <Button
            variant="primary"
            size="sm"
            className={clsx('')}
            onClick={() => toggleMenuType('bridgeRealms')}
          >
            Bridge L1 {'><'} L2
          </Button>
        </div>
        <div className="flex">
          You have X unsettled Realms
          <Button
            variant="primary"
            size="sm"
            className=""
            onClick={() => toggleMenuType('settleRealms')}
          >
            Settle Realms
          </Button>
        </div>
      </div>
    );
  }
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = useMemo(
    () => [
      {
        label: 'Resources',
        component: (
          <div className="w-full p-1">
            <RealmResources showRaidable realm={props.realm} loading={false} />
          </div>
        ),
      },
      {
        label: 'Military',
        component: (
          <div>
            {' '}
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
    ],
    [selectedTab]
  );

  return (
    <div
      className={`h-auto max-w-full col-span-4 p-6 bg-black border-4 border-double rounded-2xl shadow-md border-white/40  justify-evenly flex flex-col`}
    >
      {props.realm?.wonder && (
        <div className="w-full p-2 text-xl font-semibold text-center uppercase shadow-inner tracking-veryWide bg-black/90">
          {props.realm?.wonder}
        </div>
      )}
      <div className="flex justify-center w-full pb-4 border-b border-stone-500">
        <OrderIcon
          withTooltip
          className="self-center mx-3"
          size={'md'}
          order={props.realm.orderType.toLowerCase()}
        />
        <h2 className="flex">
          {props.realm.name} #{props.realm.realmId}
        </h2>
      </div>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => setSelectedTab(index as number)}
        variant="default"
      >
        <Tabs.List className="">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.label}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels>
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
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
                  onClick={() => toggleMenuType('bridgeRealms')}
                >
                  Bridge Realm
                </Button>
              )}
              {RealmStatus(props.realm) === 'Unsettled L2' && (
                <Button
                  size="xs"
                  variant="secondary"
                  className="w-full uppercase"
                  onClick={() => toggleMenuType('settleRealms')}
                >
                  Settle Realm
                </Button>
              )}
            </div>
          )}
          <Button
            onClick={() => openRealmDetails(props.realm.realmId)}
            variant="outline"
            size="xs"
          >
            quick view
          </Button>
          <Button
            onClick={() => {
              router.push(`/realm/${props.realm.realmId}?tab=Survey`);
            }}
            variant="primary"
            size="xs"
          >
            {isYourRealm(props.realm) ? 'manage' : 'details'}
          </Button>
          <div className="flex self-center space-x-2">
            <div>
              {!isFavourite(props.realm) && (
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => actions.addFavouriteRealm(props.realm.realmId)}
                >
                  +
                </Button>
              )}{' '}
              {isFavourite(props.realm) && (
                <Button
                  size="xs"
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    actions.removeFavouriteRealm(props.realm.realmId)
                  }
                >
                  -
                </Button>
              )}
            </div>
            <div>
              <Button
                onClick={() => {
                  togglePanelType('realm');
                  gotoAssetId(props.realm.realmId, 'realm');
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
