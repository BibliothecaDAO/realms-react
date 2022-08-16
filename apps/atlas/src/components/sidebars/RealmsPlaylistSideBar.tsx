import { Card, Button } from '@bibliotheca-dao/ui-lib/base';
import { LoadingBricks } from '@bibliotheca-dao/ui-lib/base/spinner/loading-bricks';
import { CollectionIcon } from '@heroicons/react/outline';
import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { RealmFavoriteLocalStorageKey } from '@/context/RealmContext';
import type {
  GetRealmsQuery,
  GetRealmsQueryVariables,
  RealmWhereInput,
} from '@/generated/graphql';
import { GetRealmsDocument } from '@/generated/graphql';
import type { PlaylistQueryType } from '@/hooks/settling/useRealmsPlaylist';
import {
  playlistQueryStrategy,
  realmPlaylistCursorKey,
  realmPlaylistKey,
  realmPlaylistNameKey,
  resetPlaylistState,
} from '@/hooks/settling/useRealmsPlaylist';
import SidebarHeader from '@/shared/SidebarHeader';
import apolloClient from '@/util/apolloClient';
import { storage } from '@/util/localStorage';
import AtlasSidebar from './AtlasSideBar';

type Prop = {
  isOpen: boolean;
  onClose: () => void;
  currentRealmId: number;
};

type BasePlaylist = {
  name: string;
  description?: string;
  getFilter: (args?: any) => RealmWhereInput;
};

type SystemPlaylist = {
  playlistType: PlaylistQueryType;
} & BasePlaylist;

type LocalStoragePlaylist = {
  playlistType: 'LocalStorage';
  storageKey: string;
} & BasePlaylist;

type Playlist = SystemPlaylist | LocalStoragePlaylist;

const systemPlaylists: Playlist[] = [
  {
    playlistType: 'AllRealms',
    name: 'All Realms',
    description: 'IDs 1-8000',
    getFilter: () => playlistQueryStrategy['AllRealms'](),
  },
  {
    playlistType: 'Account',
    name: 'My Empire',
    description: 'Realms under your Lordship',
    getFilter: (account) => playlistQueryStrategy['Account'](account),
  },
  {
    playlistType: 'LocalStorage',
    name: 'Favorites',
    description: 'Realms saved to Favorites',
    storageKey: RealmFavoriteLocalStorageKey,
    getFilter: (ids) => playlistQueryStrategy['Ids'](ids),
  },
  {
    playlistType: 'Raidable',
    name: 'Now Raidable',
    description: 'Realms vulnerable to Raid',
    getFilter: () => playlistQueryStrategy['Raidable'](),
  },
];

const getFilterForPlaylist: (
  playlistName: PlaylistQueryType | 'LocalStorage',
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
    case 'LocalStorage':
      filter = playlistQueryStrategy['Ids'](args.realmIds);
      break;
    case 'Raidable':
      filter = playlistQueryStrategy['Raidable']();
      break;
  }
  return filter;
};

const RealmsPlaylistSidebar = (props: Prop) => {
  const { account: starkAccount } = useStarknet();
  const starknetWallet = starkAccount
    ? BigNumber.from(starkAccount).toHexString()
    : '';
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryWithoutSegment = { ...router.query };
  delete queryWithoutSegment['segment'];

  // const [firstButton, setFirstButton] = useState<HTMLElement | null>(null);
  // useEffect(()=>{
  //   const fb = document.getElementById("playlist-0")
  //   console.log("Got first button", fb);
  //   if(fb){
  //     fb?.focus()
  //     setFirstButton(fb);
  //   }
  // }, [props.isOpen])

  return (
    <AtlasSidebar isOpen={props.isOpen}>
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

      <img
        alt="Lord sitting on throne in war room"
        style={{ textIndent: '100%', fontSize: 0 }} //  to hide alt
        className="w-full overflow-hidden bg-bottom bg-cover whitespace-nowrap h-80 bg-warRoom"
      />
      <h2 className="my-6 text-center">
        What route should we take today, ser?{' '}
      </h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {systemPlaylists.map((rp, i) => (
          <Card key={rp.name}>
            <h3>{rp.name}</h3>
            <p className="my-2">{rp.description}</p>
            <Button
              variant="primary"
              id={`playlist-${i}`}
              onClick={() => {
                if (rp.playlistType == 'AllRealms') {
                  resetPlaylistState();
                  router.push(
                    {
                      pathname: `/realm/1`,
                      query: queryWithoutSegment,
                    },
                    undefined,
                    {
                      shallow: false,
                    }
                  );
                  return;
                }

                setLoading(true);
                const args: any = {
                  starknetWallet,
                };
                if (rp.playlistType == 'LocalStorage') {
                  args.realmIds = storage<number[]>(rp.storageKey, []).get();
                }

                apolloClient
                  .query<GetRealmsQuery, GetRealmsQueryVariables>({
                    query: GetRealmsDocument,
                    variables: {
                      filter: getFilterForPlaylist(rp.playlistType, args),
                    },
                  })
                  .then((res) => {
                    setLoading(false);
                    if (res.data.realms && res.data.realms.length > 0) {
                      const realmIds = res.data.realms.map((r) => r.realmId);

                      storage(realmPlaylistCursorKey, 0).set(0);
                      storage(realmPlaylistNameKey, '').set(rp.name);
                      storage<number[]>(realmPlaylistKey, []).set(realmIds);
                      router.replace(
                        {
                          pathname: `/realm/${realmIds[0]}`,
                          query: queryWithoutSegment,
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
                  });
              }}
            >
              <CollectionIcon className="inline-block w-6 mr-2" /> Start
              Playlist
            </Button>
          </Card>
        ))}
      </div>
    </AtlasSidebar>
  );
};

export default RealmsPlaylistSidebar;
