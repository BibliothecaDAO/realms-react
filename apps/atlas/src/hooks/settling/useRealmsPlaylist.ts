import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { storage } from '@/util/localStorage';
import useKeyPress from '../useKeyPress';

export const realmPlaylistCursorKey = 'realm.playlist.cursor';
export const realmPlaylistNameKey = 'realm.playlist.name';
export const realmPlaylistKey = 'realm.playlist';

/* eslint-disable @typescript-eslint/naming-convention */
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

type Args = {
  onChange: (id: number) => void;
};

const useRealmPlaylist = (args: Args) => {
  const [currentPlaylist] = useState<string>(
    storage(realmPlaylistNameKey, '').get()
  );

  const [cursor, setCursor] = useState(
    storage<number>(realmPlaylistCursorKey, 0).get()
  );
  const leftPressed = useKeyPress({ keycode: 'LEFT' });
  const rightPressed = useKeyPress({ keycode: 'RIGHT' });

  const realmIds = storage<number[]>(realmPlaylistKey, []).get();

  useEffect(() => {
    if (leftPressed) {
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
    if (rightPressed) {
      if (cursor < realmIds.length - 1) {
        setCursor(cursor + 1);
        storage<number>(realmPlaylistCursorKey, 0).set(cursor + 1);
      } else {
        toast(`No more Realms in playlist: ${currentPlaylist}`, {
          duration: 1000,
          position: 'bottom-right',
        });
      }
    }
  }, [leftPressed, rightPressed]);

  useEffect(() => {
    if (realmIds && realmIds[cursor]) {
      args.onChange(realmIds[cursor]);
    }
  }, [cursor]);
};
export default useRealmPlaylist;
