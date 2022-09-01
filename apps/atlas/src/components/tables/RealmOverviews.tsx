import { Button } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import { useStarknet } from '@starknet-react/core';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import { useWalletContext } from '@/hooks/useWalletContext';
import { RealmListCardView } from '../cards/realms/RealmListViewCard';

interface RealmOverviewsProps {
  realms: RealmFragmentFragment[];
  isYourRealms?: boolean;
}

const JOURNEY_1_ADDRESS = '0x17963290db8c30552d0cfa2a6453ff20a28c31a2';
const JOURNEY_2_ADDRESS = '0xcdfe3d7ebfa793675426f150e928cd395469ca53';

export function RealmOverviews(props: RealmOverviewsProps) {
  const { play } = useUiSounds(soundSelector.pageTurn);
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

  // Filtering out old realms
  const usedRealms = [897, 5455, 555, 7, 2];

  const filteredRealms = props.realms.filter(
    (item) => !usedRealms.includes(item.realmId)
  );

  const [tab, setTab] = useState(0);

  const cardRefs = useRef<any>([]);

  useEffect(() => {
    // add or remove refs
    cardRefs.current = Array(filteredRealms.length)
      .fill({})
      .map((_, i) => cardRefs.current[i] || createRef());
  }, [filteredRealms]);

  const tabs = [
    <Castle key={0} className="self-center w-6 h-6 fill-current" />,
    <Helm key={1} className="self-center w-6 h-6 fill-current" />,
    <Sickle key={2} className="self-center w-6 h-6 fill-current" />,
  ];
  return (
    <div>
      <div className="flex mt-4 ml-5 w-full justify-center">
        Quick switch:
        {tabs.map((tab, index) => (
          <button
            className="ml-4"
            key={index}
            onClick={() => {
              play();
              cardRefs.current?.forEach((el) => {
                el.selectTab(index);
              });
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-6 p-6 ">
        {props.realms &&
          filteredRealms.map((realm: RealmFragmentFragment, index) => (
            <RealmListCardView
              ref={(el) => (cardRefs.current[index] = el)}
              key={realm.realmId}
              realm={realm}
            />
          ))}
      </div>
    </div>
  );
}
