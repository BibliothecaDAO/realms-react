import { OrderIcon } from '@bibliotheca-dao/ui-lib';
import { Combobox } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { OrderAffinity, LightDark } from '@/constants/orders';
import type { GetRealmQuery } from '@/generated/graphql';
import { Realm } from '@/generated/graphql';
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
            className="self-center mt-auto text-white fill-white"
            size={'lg'}
            order={realm?.orderType.toLowerCase() ?? ''}
          />
        </div>
        <div className="pl-16 text-left md:pl-40">
          <p className="text-3xl font-lords md:text-6xl">
            {realm?.realmId || '...'} || {realm?.name || '...'}
          </p>
        </div>
        <div className="flex justify-between space-x-5">
          <div className="self-center ">
            Relics Owned <br />{' '}
            <span className="text-4xl">{relicsOwnedByRealm(realm)}</span>
          </div>
          <div className="self-center ">
            Owned by <br />{' '}
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
