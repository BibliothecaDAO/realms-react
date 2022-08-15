/* eslint-disable @typescript-eslint/naming-convention */

import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RealmFavoriteLocalStorageKey } from '@/context/RealmContext';
import type { RealmWhereInput } from '@/generated/graphql';
import {
  OrderByDirectionInput,
  RealmOrderByInput,
  RealmOrderByWithRelationInput,
  useGetRealmsQuery,
} from '@/generated/graphql';
import { storage } from '@/util/localStorage';
import useRealms from './useRealms';

export const realmPlaylistCursorKey = 'realm.playlist.cursor';
export const realmPlaylistNameKey = 'realm.playlist.name';
export const realmPlaylistKey = 'realm.playlist';

export const playlists = {
  AllRealms: () => ({}),
  MyRealms: (account: string) => ({ settledOwner: { equals: account } }),
  Favorites: (favorites: number[]) => ({ realmId: { in: favorites } }),
  Raidable: () => ({
    NOT: [
      {
        lastVaultTime: { equals: null },
      },
    ],
  }),
  Order: (orderType: string[]) => ({ orderType: { in: orderType } }),
};

type Args = {
  cursor?: number;
  playlist: keyof typeof playlists;
};

const useRealmPlaylist = (args: Args) => {
  const pageSize = 10;

  const { account: starkAccount } = useStarknet();
  const starknetWallet = starkAccount
    ? BigNumber.from(starkAccount).toHexString()
    : '';

  const [filter, setFilter] = useState<RealmWhereInput>({});

  useEffect(() => {
    if (!args.playlist) {
      return;
    }
    console.log('playlist changed to', args.playlist);
    switch (args.playlist) {
      case 'AllRealms':
        setFilter(playlists['AllRealms']());
        break;
      case 'MyRealms':
        setFilter(playlists['MyRealms'](starknetWallet));
        break;
      case 'Favorites':
        setFilter(
          playlists['Favorites'](
            storage<number[]>(RealmFavoriteLocalStorageKey, []).get()
          )
        );
        break;
      case 'Raidable':
        setFilter(playlists['Raidable']());
        break;
    }
  }, [args.playlist]);

  // const direction =
  //   args.cursor % pageSize > pageSize / 2 ? 'forwards' : 'backwards';
  // const page = Math.floor(args.cursor / pageSize);

  const realms = useRealms({
    filter,
  });

  useEffect(() => {
    if (realms.data) {
      storage<number[]>(realmPlaylistKey, []).set(
        realms.data?.realms.map((r) => r.realmId)
      );
    }
  }, [realms.data]);
  return {
    pageSize,
    playlists: Object.keys(playlists),
    ...realms,
  };
};

export default useRealmPlaylist;
