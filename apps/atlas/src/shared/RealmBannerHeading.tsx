import { OrderIcon } from '@bibliotheca-dao/ui-lib';

import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';

import React from 'react';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { OrderAffinity, LightDark } from '@/constants/orders';
import type { GetRealmQuery } from '@/generated/graphql';
import useIsOwner from '@/hooks/useIsOwner';
import { shortenAddressWidth } from '@/util/formatters';
import { ownerRelic, trimmedOrder, relicsOwnedByRealm } from './Getters/Realm';

interface HeaderProps {
  onSubmit: (value: string) => void;
  hideSearchFilter?: boolean;
  realm?: GetRealmQuery;
}

export const RealmBannerHeading = (props: HeaderProps) => {
  const realm = props.realm?.realm;

  const trimmed = trimmedOrder(realm);

  const relicOwned = realm ? ownerRelic(realm)?.toString() : '0';

  const isOwner = useIsOwner(realm?.settledOwner);

  return (
    <div
      className={`bg-opacity-98 flex py-4 md:py-8 p-4 flex-wrap shadow rounded-b-2xl ${
        OrderAffinity[trimmed] === LightDark.light
          ? 'border-white'
          : 'border-black'
      }  bg-order-${trimmed} text-order-secondary-${trimmed}`}
    >
      <div className="flex justify-between w-full tracking-widest text-center uppercase ">
        <div
          className={`absolute ml-12 md:ml-4 z-10 justify-center w-10 h-16 md:w-24 md:h-40 -mt-2 border-4 border-double hidden sm:flex c-order-${trimmed} border-order-${trimmed} rounded-b-full shadow-2xl ${
            OrderAffinity[trimmed] === LightDark.light ? 'bg-white' : 'bg-black'
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
        <div className="flex items-center pl-16 text-left md:pl-40">
          <p className="text-3xl font-lords md:text-6xl">
            {realm?.realmId || '...'} || {realm?.name || '...'}
          </p>
          {!isOwner && (
            <Tooltip
              className="ml-3"
              tooltipText={
                <span>
                  'Lord: ' + shortenAddressWidth(realm?.settledOwner || '', 6)
                </span>
              }
            >
              <Crown className="w-8 fill-white" />
            </Tooltip>
          )}
        </div>
        <div className="flex justify-between space-x-5">
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
        </div>

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
  );
};
