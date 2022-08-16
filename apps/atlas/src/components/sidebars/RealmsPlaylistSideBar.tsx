import { LoadingBricks } from '@bibliotheca-dao/ui-lib/base/spinner/loading-bricks';
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
import { GetRealmsDocument, SortOrder } from '@/generated/graphql';
import {
  playlists,
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

const getFilterForPlaylist: (
  playlistName: string,
  args: any
) => RealmWhereInput = (name, args) => {
  let filter: RealmWhereInput = {};
  switch (name) {
    case 'AllRealms':
      filter = playlists['AllRealms']();
      break;
    case 'MyRealms':
      filter = playlists['MyRealms'](args.starknetWallet);
      break;
    case 'Favorites':
      filter = playlists['Favorites'](args.realmIds);
      break;
    case 'Raidable':
      filter = playlists['Raidable']();
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

  return (
    <AtlasSidebar isOpen={props.isOpen}>
      <SidebarHeader
        title="Journey through the Realms"
        onClose={props.onClose}
      ></SidebarHeader>
      <h2>
        What path should we take, ser?{' '}
        {loading ? <LoadingBricks className="inline-block w-4" /> : null}
      </h2>
      {Object.keys(playlists).map((k) => (
        <div key={k} className="p-4 my-2 border border-red-500 rounded-lg">
          <button
            onClick={() => {
              if (k == 'AllRealms') {
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
              if (k == 'Favorites') {
                args.realmIds = storage<number[]>(
                  RealmFavoriteLocalStorageKey,
                  []
                ).get();
              }

              apolloClient
                .query<GetRealmsQuery, GetRealmsQueryVariables>({
                  query: GetRealmsDocument,
                  variables: {
                    filter: getFilterForPlaylist(k as string, args),
                  },
                })
                .then((res) => {
                  setLoading(false);
                  if (res.data.realms && res.data.realms.length > 0) {
                    const realmIds = res.data.realms.map((r) => r.realmId);

                    storage(realmPlaylistCursorKey, 0).set(0);
                    storage(realmPlaylistNameKey, '').set(k);
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
                    toast(`Playlist ${k} has no Realms`);
                  }
                });
            }}
            className=""
          >
            {k}
          </button>
        </div>
      ))}
    </AtlasSidebar>
  );
};

export default RealmsPlaylistSidebar;
