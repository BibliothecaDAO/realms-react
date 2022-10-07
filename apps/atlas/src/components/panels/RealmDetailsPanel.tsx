import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';
import { BookmarkIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { UserAgent } from '@quentin-sommer/react-useragent';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { RealmHistoryPanel } from '@/components/panels/Realms/panels/RealmHistoryPanel';
import { RealmFavoriteLocalStorageKey } from '@/context/RealmContext';
import { useGetRealmQuery } from '@/generated/graphql';
import type { Realm } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import useFood from '@/hooks/settling/useFood';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useRealmDetailHotkeys from '@/hooks/settling/useRealmDetailHotkeys';
import useRealmPlaylist from '@/hooks/settling/useRealmsPlaylist';
import useResources from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import useKeyPress from '@/hooks/useKeyPress';
import usePrevious from '@/hooks/usePrevious';
import { trimmedOrder } from '@/shared/Getters/Realm';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';

import { storage } from '@/util/localStorage';
import RealmsPlaylistSidebar from '../sidebars/RealmsPlaylistSideBar';
import { BasePanel } from './BasePanel';
import Food from './Realms/Food';
import Overview from './Realms/Overview';
import RealmArmyPanel from './Realms/panels/RealmArmyPanel';
import RealmLorePanel from './Realms/panels/RealmLorePanel';
import ResourceDetails from './Realms/Resources';
import RealmToolbar from './Realms/Toolbar';

interface RealmDetailsPanelProps {
  realmId: number;
}

export function RealmDetailsPanel({ realmId }: RealmDetailsPanelProps) {
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

  const { loading: loadingResources } = useResources(realm as Realm);

  const { subview, set } = useRealmDetailHotkeys(
    router.query['tab'] as Subview
  );

  const loadingHooks = loadingBuildings || loadingFood || loadingResources;

  const [showPlaylists, setShowPlaylists] = useState(false);

  const pushPage = (value) => {
    router.replace(
      {
        pathname: `/realm/${value}`,
        query: {
          tab: subview,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const isOwner = useIsOwner(realm?.settledOwner);

  const { next, prev } = useRealmPlaylist({
    onChange: (navigateToRealmId) => {
      pushPage(navigateToRealmId);
    },
  });

  const playlistPressed = useKeyPress({ key: 'p' });
  const prevPlaylistPressed = usePrevious(playlistPressed);

  useEffect(() => {
    if (playlistPressed && !prevPlaylistPressed) {
      setShowPlaylists(true);
    }
  }, [playlistPressed]);

  const order = trimmedOrder(realm);

  const color = `bg-order-${order} text-order-secondary-${order}`;

  const s = `absolute self-center px-3 py-2 rounded-full font-semibold fill-current stroke-current hover:bg-white/10 ${color} `;
  const s_icons = 'w-5 h-5 stroke-current';

  const toggleFavourite = () => {
    const favs: number[] = storage<number[]>(
      RealmFavoriteLocalStorageKey,
      []
    ).get();
    const isFavourite = favs.indexOf(realmId) > -1;

    if (isFavourite) {
      storage<number[]>(RealmFavoriteLocalStorageKey, []).set(
        favs.filter((f) => f !== realmId)
      );
      toast('Removed from Favorites');
    } else {
      storage<number[]>(RealmFavoriteLocalStorageKey, []).set(
        favs.concat(realmId)
      );
      toast('Added to Favorites');
    }
  };
  const onSetSubview = (s) => {
    router.push(
      {
        pathname: `/realm/${realm?.realmId}`,
        query: {
          tab: s,
        },
      },
      undefined,
      { shallow: true }
    );
    set(s);
  };

  const favoritesPressed = useKeyPress({ key: 'f' });
  const prevFavoritesPressed = usePrevious(favoritesPressed);
  useEffect(() => {
    if (favoritesPressed && !prevFavoritesPressed) {
      toggleFavourite();
    }
  }, [favoritesPressed]);

  const quickActions = [
    {
      icon: <ArrowLongRightIcon className={s_icons} />,
      action: () => next(),
      class: `-mr-28 ${s}`,
    },
    {
      icon: <RectangleStackIcon className={s_icons} />,
      action: () => {
        setShowPlaylists(true);
      },
      class: `-mt-24 -mr-14 ${s}`,
    },
    {
      icon: <BookmarkIcon className={s_icons} />,
      action: () => toggleFavourite(),
      class: `mb-24 -ml-14 ${s}`,
    },
    {
      icon: <ArrowLongLeftIcon className={s_icons} />,
      action: () => prev(),
      class: `-ml-28 ${s}`,
    },
    // {
    //   icon: <Helm className={s_icons + ' fill-current'} />,
    //   action: () => next(),
    //   class: `mt-24 -ml-14 ${s}`,
    // },
    // {
    //   icon: <Helm className={s_icons + ' fill-current'} />,
    //   action: () => next(),
    //   class: `mb-24 -ml-14 ${s}`,
    // },
  ];

  return (
    <BasePanel open={true}>
      <RealmsPlaylistSidebar
        currentRealmId={realmId}
        isOpen={showPlaylists}
        onClose={() => setShowPlaylists(false)}
      />
      <div className="grid w-full h-full overflow-auto bg-cover">
        <div className="relative col-span-6">
          <RealmBannerHeading
            onSubmit={(value) => pushPage(parseInt(value))}
            realm={realmData}
            hideSearchFilter
          />

          <div className="fixed bottom-0 right-0 z-50 text-black">
            <div
              className={` w-40 h-40  ${color} flex justify-center align-middle text-black shadow-2xl border-white/20 card border`}
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
          <UserAgent>
            {({ mobile }) => (
              <RealmToolbar
                selected={subview}
                isOwnerOfRealm={isOwner}
                isMobile={mobile}
                color={color}
                onSetSubview={(s) => onSetSubview(s)}
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
                  <RealmArmyPanel
                    open={subview == 'Army'}
                    buildings={buildings}
                    realm={realmData?.realm}
                    loading={loadingHooks}
                  />

                  <ResourceDetails
                    open={subview == 'Resources'}
                    realmFoodDetails={realmFoodDetails}
                    availableFood={availableFood}
                    buildings={buildings}
                    realm={realmData}
                    loading={loadingHooks}
                  />

                  <Overview
                    open={subview == 'Overview'}
                    onSetSubview={(s) => onSetSubview(s)}
                    buildingUtilisation={buildingUtilisation}
                    realmFoodDetails={realmFoodDetails}
                    availableFood={availableFood}
                    buildings={buildings}
                    realm={realmData}
                    loading={loadingHooks}
                  />
                  <Food
                    open={subview == 'Food'}
                    realmFoodDetails={realmFoodDetails}
                    availableFood={availableFood}
                    buildings={buildings}
                    realm={realmData}
                    loading={loadingHooks}
                  />
                  <RealmHistoryPanel
                    open={subview == 'History'}
                    realmId={realmId}
                  />

                  <RealmLorePanel open={subview == 'Lore'} realm={realmData} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
