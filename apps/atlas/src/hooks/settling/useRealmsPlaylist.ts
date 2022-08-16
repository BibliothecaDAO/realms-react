/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable sonarjs/cognitive-complexity */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { storage } from '@/util/localStorage';
import useKeyPress from '../useKeyPress';

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
  // Order: (orderType: string[]) => ({ orderType: { in: orderType } }),
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
  const leftPressed = useKeyPress({ keycode: 'LEFT' });
  const rightPressed = useKeyPress({ keycode: 'RIGHT' });

  const realmIds = storage<number[]>(realmPlaylistKey, []).get();

  useEffect(() => {
    const currentPlaylist = storage<string>(realmPlaylistNameKey, '').get();
    const noPlaylistSpecified = currentPlaylist == '';

    if (leftPressed) {
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
            position: 'bottom-right',
          });
        }
      }
    }
    if (rightPressed) {
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
            position: 'bottom-right',
          });
        }
      }
    }
  }, [leftPressed, rightPressed]);

  useEffect(() => {
    const conflictingRealmIds =
      realmIdFromRoute !== undefined &&
      realmIds[cursor] !== undefined &&
      realmIdFromRoute != realmIds[cursor] &&
      Math.abs(realmIdFromRoute - realmIds[cursor]) !== 1; // allow keyboard navigation but anything else is a conflict

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
};
export default useRealmPlaylist;
