/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable sonarjs/cognitive-complexity */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { RealmWhereInput } from '@/generated/graphql';
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

type Args = {
  onChange: (id: number) => void;
};

const useRealmPlaylist = (args: Args) => {
  const router = useRouter();
  const segments = router.query?.segment ?? [];
  const realmIdFromRoute = segments[1] ? Number(segments[1]) : undefined;
  const queryWithoutSegment = { ...router.query };
  delete queryWithoutSegment['segment'];

  const [cursor, setCursor] = useState(
    storage<number>(realmPlaylistCursorKey, 0).get()
  );
  const prevCursor = usePrevious<number>(cursor);
  const leftPressed = useKeyPress({ keycode: 'LEFT' });
  const rightPressed = useKeyPress({ keycode: 'RIGHT' });

  const realmIds = storage<number[]>(realmPlaylistKey, []).get();

  const next = () => {
    const currentPlaylist = storage<string>(realmPlaylistNameKey, '').get();
    const noPlaylistSpecified = currentPlaylist == '';

    if (noPlaylistSpecified && realmIdFromRoute !== undefined) {
      router.replace(
        {
          pathname: `/realm/${realmIdFromRoute + 1}`,
          query: queryWithoutSegment,
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
          pathname: `/realm/${realmIdFromRoute - 1}`,
          query: queryWithoutSegment,
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
      args.onChange(realmIds[cursor]);
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
  return { next, prev };
};
export default useRealmPlaylist;
