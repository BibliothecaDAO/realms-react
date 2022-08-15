import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';
import { UserAgent } from '@quentin-sommer/react-useragent';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useSpring } from 'react-spring';
import { RealmHistory } from '@/components/panels/RealmDetails/RealmHistory';
import type { GetRealmsQuery, Realm } from '@/generated/graphql';
import { useGetRealmQuery } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import useFood from '@/hooks/settling/useFood';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useRealmDetailHotkeys from '@/hooks/settling/useRealmDetailHotkeys';
import type { playlists } from '@/hooks/settling/useRealmsPlaylist';
import useRealmPlaylist, {
  realmPlaylistCursorKey,
  realmPlaylistKey,
  realmPlaylistNameKey,
} from '@/hooks/settling/useRealmsPlaylist';
import useResources from '@/hooks/settling/useResources';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import useIsOwner from '@/hooks/useIsOwner';
import useKeyPress from '@/hooks/useKeyPress';
import usePrevious from '@/hooks/usePrevious';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
import SidebarHeader from '@/shared/SidebarHeader';
import { storage } from '@/util/localStorage';
import AtlasSidebar from '../sidebars/AtlasSideBar';
import { BasePanel } from './BasePanel';
import Army from './RealmDetails/Army';
import ResourceDetails from './RealmDetails/Resources';
import Survey from './RealmDetails/Survey';
import RealmToolbar from './RealmDetails/Toolbar';

interface RealmDetailsPanelProps {
  realmId: number;
}

export function RealmDetailsPanel({ realmId }: RealmDetailsPanelProps) {
  const {
    isDisplayLarge,
    selectedId,
    selectedPanel,
    openDetails,
    togglePanelType,
  } = useAtlasContext();

  const router = useRouter();

  const { data: realmData, loading } = useGetRealmQuery({
    variables: { id: realmId },
    pollInterval: 5000,
  });

  const realm = realmData?.realm;

  const {
    buildings,
    buildingUtilisation,
    loading: loadingBuildings,
  } = useBuildings(realm as Realm);

  const {
    realmFoodDetails,
    availableFood,
    loading: loadingFood,
  } = useFood(realm as Realm);

  const { realmsResourcesDetails, loading: loadingResources } = useResources(
    realm as Realm
  );

  const { subview, set } = useRealmDetailHotkeys(
    router.query['tab'] as Subview
  );

  const loadingHooks = loadingBuildings || loadingFood || loadingResources;

  // useEffect(() => {
  //   if (realm) {
  //     router.push(
  //       {
  //         pathname: `realm/${realm?.realmId}`,
  //         query: {
  //           tab: subview,
  //         },
  //       },
  //       undefined,
  //       { shallow: true }
  //     );
  //   }
  // }, [subview]);

  const [showPlaylists, setShowPlaylists] = useState(false);
  const [cursor, setCursor] = useState(
    storage<number>(realmPlaylistCursorKey, 0).get()
  );

  const [navigationLock, setNavigationLock] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<
    keyof typeof playlists
  >(
    (router.query['playlist'] as any) ?? storage(realmPlaylistNameKey, '').get()
  );

  // console.log("router query is", router.query["playlist"])

  const prevPlaylist = usePrevious<string>(currentPlaylist);
  // const [playlistDirty, setPlaylistDirty] = useState(false);
  // useEffect(()=>{
  //   if(currentPlaylist !== prevPlaylist){
  //     setPlaylistDirty(true);
  //   }
  // }, [currentPlaylist]);

  const pushPage = (value) => {
    router.replace(
      {
        pathname: `/realm/${value}`,
        query: {
          tab: subview,
          playlist: currentPlaylist,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const leftPressed = useKeyPress({ keycode: 'LEFT' });
  const rightPressed = useKeyPress({ keycode: 'RIGHT' });
  const isOwner = useIsOwner(realm?.settledOwner);

  const realmsPlaylist = useRealmPlaylist({
    playlist: currentPlaylist as any,
  });

  const realmIds = useMemo(() => {
    return realmsPlaylist.data?.realms.map((rea) => rea.realmId);
  }, [realmsPlaylist.data]);

  useEffect(() => {
    console.log('realmIds changed', realmsPlaylist.data, realmIds);
    if (realmIds && realmIds[cursor]) {
      pushPage(realmIds[cursor]);
      setNavigationLock(false);
    }
  }, [realmIds]);

  useEffect(() => {
    console.log('cursor changed', navigationLock, realmIds);
    if (navigationLock) {
      return;
    }
    if (realmIds && realmIds[cursor]) {
      pushPage(realmIds[cursor]);
    }
  }, [cursor]);

  /*

  useEffect(() => {
    
    console.log(
      'realmsPlaylist data changed',
      realmsPlaylist.data,
      realmsPlaylist.loading
    );
    
    const resolvedCursor = cursor % realmsPlaylist.pageSize;

    const shouldNavigateToCursor =
        (prevPlaylist !== currentPlaylist &&
        navigationLock) || navigationLock &&
        !realmsPlaylist.loading;
    console.log("navigationLock", navigationLock);
    console.log("shouldNavigate", shouldNavigateToCursor)
    
    if (realmsPlaylist.data?.realms && shouldNavigateToCursor) {
      console.log(
        'data changed, navigating to cursor',
        resolvedCursor,
        'realm Id',
        realmsPlaylist.data.realms[resolvedCursor]?.realmId
      );
      if (
        realmsPlaylist.data?.realms &&
        realmsPlaylist.data.realms[resolvedCursor]
      ) {
        pushPage(realmsPlaylist.data.realms[resolvedCursor].realmId);
      }      
      setNavigationLock(false);
    }
  }, [realmIds]);
  */

  /*
  useEffect(() => {
    console.log('cursor changed', cursor);
    console.log('Navigation locked', navigationLock);
    // console.log('playlist dirty', playlistDirty)
    // Don't navigate to page if a new playlist is loading
    if (navigationLock) {
      return;
    }
    const resolvedCursor = cursor % realmsPlaylist.pageSize;
    storage<number>(RealmPlaylistCursorKey, 0).set(cursor);

    if (
      realmsPlaylist.data?.realms &&
      realmsPlaylist.data.realms[resolvedCursor]
    ) {
      console.log(
        'changing page route due to cursor change',
        realmsPlaylist.data.realms[resolvedCursor]?.realmId
      );
      pushPage(realmsPlaylist.data.realms[resolvedCursor].realmId);
    }
  }, [cursor]);
  */

  const playlistPressed = useKeyPress({ key: 'p' });
  const prevPlaylistPressed = usePrevious(playlistPressed);

  useEffect(() => {
    if (playlistPressed && !prevPlaylistPressed) {
      setShowPlaylists(true);
    }
  }, [playlistPressed]);

  useEffect(() => {
    if (!realm) {
      return;
    }
    if (leftPressed) {
      // pushPage(realm.realmId - 1);
      // pushPage(realmsPlaylist.prev())
      setCursor(cursor - 1);
      storage<number>(realmPlaylistCursorKey, 0).set(cursor - 1);
      // realmsPlaylist.prev()
    }
    if (rightPressed) {
      // pushPage(realmsPlaylist.next());
      // pushPage(realm.realmId + 1);
      setCursor(cursor + 1);
      storage<number>(realmPlaylistCursorKey, 0).set(cursor + 1);
      // realmsPlaylist.next()
    }
  }, [leftPressed, rightPressed]);

  const order = realm?.orderType?.replaceAll('_', ' ').toLowerCase() ?? '';

  const color = `bg-order-${order.replace('the ', '').replace('the_', '')} 
    text-order-secondary-${order.replace('the ', '').replace('the_', '')}`;

  const s =
    'absolute self-center px-3 py-2 rounded-full font-semibold text-white fill-current stroke-current hover:bg-white/10 ';
  const s_icons = 'w-5 h-5 text-white fill-current stroke-current';
  const quickActions = [
    {
      icon: <ArrowNarrowRightIcon className={s_icons} />,
      action: () => pushPage(realm ? realm?.realmId + 1 : ''),
      class: `-mr-28 ${s}`,
    },
    {
      icon: <Helm className={s_icons} />,
      action: () => pushPage(realm?.realmId ?? ''),
      class: `-mt-24 -mr-14 ${s}`,
    },
    {
      icon: <Helm className={s_icons} />,
      action: () => pushPage(realm?.realmId ?? ''),
      class: `-mb-24 -mr-14 ${s}`,
    },
    {
      icon: <ArrowNarrowLeftIcon className={s_icons} />,
      action: () => pushPage(realm ? realm?.realmId - 1 : ''),
      class: `-ml-28 ${s}`,
    },
    {
      icon: <Helm className={s_icons} />,
      action: () => pushPage(realm?.realmId ?? ''),
      class: `mt-24 -ml-14 ${s}`,
    },
    {
      icon: <Helm className={s_icons} />,
      action: () => pushPage(realm?.realmId ?? ''),
      class: `mb-24 -ml-14 ${s}`,
    },
  ];

  return (
    <BasePanel open={selectedPanel === 'realm'}>
      <AtlasSidebar isOpen={showPlaylists}>
        <SidebarHeader
          title="Journey through the Realms"
          onClose={() => setShowPlaylists(false)}
        ></SidebarHeader>
        <h2>What path should we take, ser?</h2>
        {realmsPlaylist.playlists.map((k) => (
          <div key={k} className="p-4 my-2 border border-red-500 rounded-lg">
            <button
              onClick={() => {
                // setNavigationLock(true);
                setCurrentPlaylist(k as any);
                storage(realmPlaylistCursorKey, 0).set(0);
                storage(realmPlaylistNameKey, 'MyRealms').set(k);
                // setCursor(0);
                setShowPlaylists(false);
              }}
              className=""
            >
              {k}
            </button>
          </div>
        ))}
      </AtlasSidebar>
      <div className="grid w-full h-full overflow-auto bg-cover">
        <div className="relative col-span-6">
          <RealmBannerHeading
            onSubmit={(value) => pushPage(parseInt(value))}
            key={realm?.realmId ?? ''}
            order={realm?.orderType?.replaceAll('_', ' ').toLowerCase() ?? ''}
            title={realm?.name ?? ''}
            realmId={realmId}
            hideSearchFilter
          />
          <div className="fixed z-50 text-black bottom-10 right-10">
            <div
              className={`w-40 h-40 rounded-full border-4 border-double ${color} flex justify-center align-middle text-black bg-opacity-95 shadow-2xl`}
            >
              {quickActions.map((a, i) => {
                return (
                  <button onClick={a.action} key={i} className={a.class}>
                    {a.icon}
                  </button>
                );
              })}
              <div className="self-center w-8 h-8 border rounded-full"></div>
            </div>
          </div>
          <div className="fixed bottom-0 z-50 px-2 py-1 uppercase bg-gray-800 rounded-t-md font-display right-8">
            <span className="opacity-30">P</span> Playlist
          </div>
          <UserAgent>
            {({ mobile }) => (
              <RealmToolbar
                selected={subview}
                isOwnerOfRealm={isOwner}
                isMobile={mobile}
                color={color}
                onSetSubview={(s) => {
                  router.push(
                    {
                      pathname: `realm/${realm?.realmId}`,
                      query: {
                        tab: s,
                        playlist: currentPlaylist,
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                  set(s);
                }}
                className=""
                onNavigateIntent={(dir) => {
                  if (!realm) {
                    return;
                  }
                  if (dir == 'previous') {
                    pushPage(realm.realmId - 1);
                  }
                  if (dir == 'next') {
                    pushPage(realm.realmId + 1);
                  }
                }}
              />
            )}
          </UserAgent>
          <div className="relative w-full h-full">
            <div className="w-full h-full py-10 overflow-x-scroll md:overflow-x-visible">
              {realmData?.realm ? (
                <>
                  <Army
                    open={subview == 'Army'}
                    availableResources={realmsResourcesDetails}
                    buildings={buildings}
                    realm={realmData?.realm}
                    loading={loadingHooks}
                  />

                  <ResourceDetails
                    open={subview == 'Resources'}
                    availableResources={realmsResourcesDetails}
                    realmFoodDetails={realmFoodDetails}
                    availableFood={availableFood}
                    buildings={buildings}
                    realm={realmData}
                    loading={loadingHooks}
                  />

                  <Survey
                    open={subview == 'Survey'}
                    availableResources={realmsResourcesDetails}
                    buildingUtilisation={buildingUtilisation}
                    realmFoodDetails={realmFoodDetails}
                    availableFood={availableFood}
                    buildings={buildings}
                    realm={realmData}
                    loading={loadingHooks}
                  />

                  <RealmHistory open={subview == 'History'} realmId={realmId} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
