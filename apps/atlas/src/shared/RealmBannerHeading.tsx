import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib';

import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import React from 'react';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { OrderAffinity, LightDark } from '@/constants/orders';
import { useAtlasContext } from '@/context/AtlasContext';
import type { GetRealmQuery } from '@/generated/graphql';
import useIsOwner from '@/hooks/useIsOwner';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { shortenAddress } from '@/util/formatters';
import { ownerRelic, trimmedOrder } from './Getters/Realm';

interface HeaderProps {
  onSubmit: (value: string) => void;
  hideSearchFilter?: boolean;
  realm?: GetRealmQuery;
}

export const RealmBannerHeading = (props: HeaderProps) => {
  const realm = props.realm?.realm;
  const { starknetId } = useStarkNetId(realm?.settledOwner || '');

  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const trimmed = trimmedOrder(realm);

  const relicOwned = realm ? ownerRelic(realm)?.toString() : '0';

  const isOwner = useIsOwner(realm?.settledOwner);

  return (
    <div className="bg-cover bg-snake">
      <div
        className={`bg-opacity-80 flex py-4 md:py-8 p-4 flex-wrap shadow     ${
          OrderAffinity[trimmed] === LightDark.light
            ? 'border-white'
            : 'border-black'
        }  bg-order-${trimmed} text-order-secondary-${trimmed}`}
      >
        <div className="flex justify-between w-full tracking-widest text-center uppercase ">
          <div
            className={`absolute ml-12 md:ml-4 z-20 justify-center w-10 h-16 md:w-24 md:h-40 -mt-2 border-4 border-double hidden sm:flex c-order-${trimmed} border-order-${trimmed}  shadow-2xl card ${
              OrderAffinity[trimmed] === LightDark.light
                ? 'bg-white'
                : 'bg-black'
            }`}
          >
            <OrderIcon
              withTooltip
              containerClassName="my-4 flex flex-col items-center justify-center"
              className="self-center mt-auto fill-white"
              size={'lg'}
              order={realm?.orderType.toLowerCase() ?? ''}
            />
          </div>
          <div className="flex items-center justify-between pl-16 text-left md:pl-40">
            <div>
              <span className="flex font-display">
                <Crown className="w-6 mr-3 fill-white" />{' '}
                {starknetId ?? starknetId}
                {!starknetId && isOwner ? 'you' : ''}
                {!starknetId && !isOwner
                  ? shortenAddress(realm?.settledOwner || '')
                  : ''}
              </span>
              <h1 className="font-semibold">
                {realm?.name || '...'} | {realm?.realmId || '...'}
              </h1>
            </div>
          </div>
          {realm?.realmId && (
            <div className="self-center">
              <Button
                onClick={() => {
                  navigateToAsset(realm?.realmId, 'realm');
                }}
                variant="primary"
              >
                <Globe className="w-5 fill-current" />
                <span className="hidden ml-4 text-sm sm:block">
                  {' '}
                  ({realm?.latitude.toFixed(2)}, {realm?.longitude.toFixed(2)})
                </span>
              </Button>
            </div>
          )}

          {/* <div className="flex justify-between space-x-5">
            <div className="flex self-center">
              <span className="text-4xl">{relicsOwnedByRealm(realm)}</span>
              <Relic className={` w-4 ml-4 fill-yellow-500`} />
            </div>
            <div className="self-center ">
              <button
                onClick={() => {
                  props.onSubmit(relicOwned ?? '0');
                }}
                className="text-4xl"
              >
                {ownerRelic(realm)}
              </button>
            </div>
          </div> */}

          {!props.hideSearchFilter && (
            <SearchFilter
              placeholder="SEARCH BY ID"
              onSubmit={(value) => {
                props.onSubmit(parseInt(value) ? value : '');
              }}
              defaultValue={realm?.realmId.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
};
