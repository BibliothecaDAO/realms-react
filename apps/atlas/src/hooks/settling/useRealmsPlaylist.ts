/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable sonarjs/cognitive-complexity */

import { useAccount } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { Playlist } from '@/components/sidebars/RealmsPlaylistSideBar';
import type {
  GetRealmsQuery,
  GetRealmsQueryVariables,
  RealmWhereInput,
} from '@/generated/graphql';
import { GetRealmsDocument } from '@/generated/graphql';
import apolloClient from '@/util/apolloClient';
import { storage } from '@/util/localStorage';
import useKeyPress from '../useKeyPress';
import usePrevious from '../usePrevious';

export const realmPlaylistCursorKey = 'realm.playlist.cursor';
export const realmPlaylistNameKey = 'realm.playlist.name';
export const realmPlaylistKey = 'realm.playlist';

export type PlaylistQueryType = 'AllRealms' | 'Account' | 'Ids' | 'Raidable';
type GetPlaylistQueryFilterFunction = (args?: any) => RealmWhereInput;

export const playlistQueryStrategy: Record<
  PlaylistQueryType,
  GetPlaylistQueryFilterFunction
> = {
  AllRealms: () => ({}),
  Account: (account: string) => ({ settledOwner: { equals: account } }),
  Ids: (ids: number[]) => ({ realmId: { in: ids } }),
  Raidable: () => ({ lastVaultTime: { not: null } }),
};

export const resetPlaylistState = () => {
  storage(realmPlaylistCursorKey, 0).remove();
  storage(realmPlaylistNameKey, '').remove();
  storage(realmPlaylistKey, []).remove();
};

const getFilterForPlaylist: (
  playlistName: Playlist['playlistType'],
  args: any
) => RealmWhereInput = (name, args) => {
  let filter: RealmWhereInput = {};
  switch (name) {
    case 'AllRealms':
      filter = playlistQueryStrategy['AllRealms']();
      break;
    case 'Account':
      filter = playlistQueryStrategy['Account'](args.starknetWallet);
      break;
    case 'OwnedBy':
      filter = playlistQueryStrategy['Account'](args.starknetWallet);
      break;
    case 'LocalStorage':
      filter = playlistQueryStrategy['Ids'](args.realmIds);
      break;
    case 'Raidable':
      filter = playlistQueryStrategy['Raidable']();
      break;
  }
  return filter;
};

type Args = {
  onChange?: (id: number) => void;
};

const useRealmPlaylist = (args: Args) => {
  const router = useRouter();
  const { address } = useAccount();
  const starknetWallet = address ? BigNumber.from(address).toHexString() : '';
  const realmIdFromRoute = router.query?.realmId
    ? Number(router.query?.realmId)
    : undefined;
  const query = { ...router.query };

  const [cursor, setCursor] = useState(
    storage<number>(realmPlaylistCursorKey, 0).get()
  );
  const prevCursor = usePrevious<number>(cursor);
  const leftPressed = useKeyPress({ keycode: 'LEFT' });
  const rightPressed = useKeyPress({ keycode: 'RIGHT' });

  const realmIds = storage<number[]>(realmPlaylistKey, []).get();

  const setPlaylistState = async (
    rp: Playlist,
    noRedirect = false,
    cursorRealmId = 0
  ) => {
    const _args: any = {
      starknetWallet:
        rp.playlistType == 'OwnedBy' ? rp.address : starknetWallet,
    };
    if (rp.playlistType == 'LocalStorage') {
      _args.realmIds = storage<number[]>(rp.storageKey, []).get();
    }

    try {
      const res = await apolloClient.query<
        GetRealmsQuery,
        GetRealmsQueryVariables
      >({
        query: GetRealmsDocument,
        variables: {
          filter: getFilterForPlaylist(rp.playlistType, _args),
        },
      });

      if (res.data.realms && res.data.realms.length > 0) {
        !noRedirect && toast(`Realm Playlist: ${rp.name}`);
        const realmIds = res.data.realms.map((r) => r.realmId);
        storage(realmPlaylistCursorKey, 0).set(
          cursorRealmId ? realmIds.findIndex((id) => id == cursorRealmId) : 0
        );
        storage(realmPlaylistNameKey, '').set(rp.name);
        storage<number[]>(realmPlaylistKey, []).set(realmIds);
        !noRedirect &&
          router.replace(
            {
              pathname: `/realm/${realmIds[0]}`,
              query: { ...query },
            },
            undefined,
            {
              shallow: true,
            }
          );
      }
      if (!res.loading && res.data.realms.length == 0) {
        toast(`Playlist ${rp.name} has no Realms`);
      }

      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const next = () => {
    const currentPlaylist = storage<string>(realmPlaylistNameKey, '').get();
    const noPlaylistSpecified = currentPlaylist == '';

    if (noPlaylistSpecified && realmIdFromRoute !== undefined) {
      router.replace(
        {
          pathname: `/realm/[realmId]`,
          query: { ...query, realmId: realmIdFromRoute + 1 },
        },
        undefined,
        { shallow: true }
      );
    } else {
      if (cursor < realmIds.length - 1) {
        setCursor(cursor + 1);
        storage<number>(realmPlaylistCursorKey, 0).set(cursor + 1);
      } else {
        toast(`Reached end of Realm Playlist: ${currentPlaylist}`, {
          duration: 1000,
          position: 'top-left',
        });
      }
    }
  };

  const prev = () => {
    const currentPlaylist = storage<string>(realmPlaylistNameKey, '').get();
    const noPlaylistSpecified = currentPlaylist == '';

    if (noPlaylistSpecified && realmIdFromRoute !== undefined) {
      // use realm id
      router.replace(
        {
          pathname: `/realm/[realmId]`,
          query: { ...query, realmId: realmIdFromRoute - 1 },
        },
        undefined,
        { shallow: true }
      );
    } else {
      if (cursor > 0) {
        setCursor(cursor - 1);
        storage<number>(realmPlaylistCursorKey, 0).set(cursor - 1);
      } else {
        toast(`Already at start of Playlist: ${currentPlaylist}`, {
          duration: 1000,
          position: 'top-left',
        });
      }
    }
  };

  useEffect(() => {
    if (leftPressed) {
      prev();
    }
    if (rightPressed) {
      next();
    }
  }, [leftPressed, rightPressed]);

  useEffect(() => {
    const prevRealmId = realmIds[prevCursor as number];

    // Need to handle case where user was in a playlist but navigated to a realm
    // not in the current playlist. Variables such as prevCursor are kept track of
    // to determine if there is a difference between the playlist and the realmId page param.
    // If there is a conflict, the page param takes precedent, and playlist state is reset.
    const conflictingRealmIds =
      realmIdFromRoute !== undefined &&
      realmIds[cursor] !== undefined &&
      realmIdFromRoute != realmIds[cursor] &&
      prevCursor == undefined &&
      realmIdFromRoute != prevRealmId;

    if (realmIds && realmIds[cursor] && !conflictingRealmIds) {
      args.onChange && args.onChange(realmIds[cursor]);
    }

    if (conflictingRealmIds) {
      console.log(
        'realmIds in conflict between page route',
        realmIdFromRoute,
        'and playlist',
        realmIds[cursor],
        ',resetting playlist state and navigating using page route params.'
      );
      resetPlaylistState();
    }
  }, [cursor]);
  return { next, prev, setPlaylistState };
};
export default useRealmPlaylist;
