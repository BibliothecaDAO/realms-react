import { Card, Button } from '@bibliotheca-dao/ui-lib/base';
import { LoadingBricks } from '@bibliotheca-dao/ui-lib/base/spinner/loading-bricks';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { useAccount } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AtlasSidebar from '@/components/map/AtlasSideBar';
import { RealmFavoriteLocalStorageKey } from '@/context/RealmContext';
import type { PlaylistQueryType } from '@/hooks/settling/useRealmsPlaylist';
import useRealmPlaylist, {
  resetPlaylistState,
} from '@/hooks/settling/useRealmsPlaylist';
import SidebarHeader from '@/shared/SidebarHeader';

type Prop = {
  isOpen: boolean;
  onClose: () => void;
  currentRealmId: number;
};

type BasePlaylist = {
  name: string;
  description?: string;
};

type SystemPlaylist = {
  playlistType: PlaylistQueryType;
} & BasePlaylist;

type LocalStoragePlaylist = {
  playlistType: 'LocalStorage';
  storageKey: string;
} & BasePlaylist;

type AddressPlaylist = {
  playlistType: 'OwnedBy';
  address: string;
} & BasePlaylist;

export type Playlist = SystemPlaylist | LocalStoragePlaylist | AddressPlaylist;

export const systemPlaylists: Playlist[] = [
  {
    playlistType: 'AllRealms',
    name: 'All Realms',
    description: 'IDs 1-8000',
  },
  {
    playlistType: 'Account',
    name: 'My Empire',
    description: 'Realms under your Lordship',
  },
  {
    playlistType: 'LocalStorage',
    name: 'Favorites',
    description: 'Realms saved to Favorites',
    storageKey: RealmFavoriteLocalStorageKey,
  },
  {
    playlistType: 'Raidable',
    name: 'Now Raidable',
    description: 'Realms vulnerable to Raid',
  },
];

export const ACCOUNT_PLAYLIST_INDEX = systemPlaylists.findIndex(
  (p) => p.playlistType === 'Account'
);

// Curated playlists
const curatedPlaylists: Playlist[] = [
  {
    playlistType: 'OwnedBy',
    name: 'Lord of a Few',
    address:
      '0x0380f7644a98f9d9915dbaa0bbd4b3fe8671a46fbf9f9ab7a7b1dc3b7ce9ec72',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Redbeard',
    address:
      '0x037c6b561b367a85b68668e8663041b9e2f4199c346fbda97dc0c2167f7a6016',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Unidendefi',
    address: '0xe9b53ad255f02c6eecabab7edbc4f7fe9fc85f5281feec461d587b3461ddfe',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Milan',
    address:
      '0x0380f7644a98f9d9915dbaa0bbd4b3fe8671a46fbf9f9ab7a7b1dc3b7ce9ec72',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Abrax',
    address: '0x5979f502578dbcc1df80fb189548560b5a363e1ec8c760caa784497e9e6979',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Secretive',
    address:
      '0x01f447b1d086c66533b481311813a68cde116aacf39fb9611636f18c79502241',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Amaro',
    address:
      '0x031c15a4dd86c0c3bc2de4c5407a7277e1519768d8fe95574a03dd8fc32d95a4',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Tenox',
    address:
      '0x07deb0da237ee37276489278fe16eff3e6a3d62f830446104d93c892df771ca2',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Fomentador',
    address:
      '0x02523823d93EC483231b5F9756953c527E396a347f18e2218dd339b0f2911cF5',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Dham',
    address:
      '0x007D3246639ed9e666c5Ceb9B4dc533f731AF1c866487977E0474d0465A73426',
    description: '[alpha-test]',
  },
  {
    playlistType: 'OwnedBy',
    name: 'Lord Squiddy',
    address:
      '0x042fB2f4dEC8757a05aB14e26b66A76C6265A4128a83A03C9D7Cbf3b665f8fea',
    description: '[alpha-test]',
  },
];

const RealmsPlaylistSidebar = (props: Prop) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>();
  const { setPlaylistState } = useRealmPlaylist({});

  return (
    <AtlasSidebar isOpen={props.isOpen} containerClassName="z-[40]">
      <SidebarHeader
        titleComponent={
          <h1 className="flex">
            Journey{' '}
            <span className="flex flex-col items-center justify-center mx-2 text-lg leading-4">
              <span>through</span>
              <span>the</span>
            </span>{' '}
            Realms
            {loading ? (
              <LoadingBricks className="inline-block w-8 ml-2" />
            ) : null}
          </h1>
        }
        title="Journey through the Realms"
        onClose={props.onClose}
      ></SidebarHeader>

      <h2 className="my-6 text-center">
        What route should we take today, ser?{' '}
      </h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {systemPlaylists.concat(curatedPlaylists).map((rp, i) => (
          <Card key={rp.name}>
            <h3>{rp.name}</h3>
            <p className="my-2">{rp.description}</p>
            <Button
              disabled={loading}
              className={loading ? 'animate-pulse' : ''}
              variant="primary"
              id={`playlist-${i}`}
              onClick={async () => {
                if (rp.playlistType == 'AllRealms') {
                  toast(`Realm Playlist: ${rp.name}`, {
                    icon: <RectangleStackIcon className="w-6" />,
                  });
                  resetPlaylistState();
                  // router.push(
                  //   {
                  //     pathname: `/realm/[realmId]`,
                  //     query: queryWithoutSegment,
                  //   },
                  //   undefined,
                  //   {
                  //     shallow: false,
                  //   }
                  // );
                  return;
                }
                setSelectedPlaylist(rp.name);
                setLoading(true);
                await setPlaylistState(rp);
                setLoading(false);
                setSelectedPlaylist(undefined);
              }}
            >
              <RectangleStackIcon className="inline-block w-6 mr-2" />{' '}
              {loading && selectedPlaylist == rp.name
                ? 'Loading...'
                : 'Start Playlist'}
            </Button>
          </Card>
        ))}
      </div>
    </AtlasSidebar>
  );
};

export default RealmsPlaylistSidebar;
