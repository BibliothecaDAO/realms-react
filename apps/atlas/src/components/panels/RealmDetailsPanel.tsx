import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';
import { UserAgent } from '@quentin-sommer/react-useragent';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSpring } from 'react-spring';
import { RealmHistory } from '@/components/panels/RealmDetails/RealmHistory';
import type { Realm } from '@/generated/graphql';
import { useGetRealmQuery } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import useFood from '@/hooks/settling/useFood';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useRealmDetailHotkeys from '@/hooks/settling/useRealmDetailHotkeys';
import useResources from '@/hooks/settling/useResources';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import useIsOwner from '@/hooks/useIsOwner';
import useKeyPress from '@/hooks/useKeyPress';
import { trimmedOrder } from '@/shared/Getters/Realm';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
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

  useEffect(() => {
    if (realm) {
      router.push(
        {
          pathname: `realm/${realm?.realmId}`,
          query: {
            tab: subview,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [subview]);

  const pushPage = (value) => {
    if (!loading) {
      router.push('/realm/' + value + '?tab=Survey', undefined, {
        shallow: true,
      });
    }
  };

  const leftPressed = useKeyPress({ keycode: 'LEFT' });
  const rightPressed = useKeyPress({ keycode: 'RIGHT' });
  const isOwner = useIsOwner(realm?.settledOwner);

  useEffect(() => {
    if (!realm) {
      return;
    }
    if (leftPressed) {
      pushPage(realm.realmId - 1);
    }
    if (rightPressed) {
      pushPage(realm.realmId + 1);
    }
  }, [leftPressed, rightPressed]);

  const order = trimmedOrder(realm);

  const color = `bg-order-${order} text-order-secondary-${order}`;

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
      <div className="grid w-full h-full overflow-auto bg-cover">
        <div className="relative col-span-6">
          <RealmBannerHeading
            onSubmit={(value) => pushPage(parseInt(value))}
            realm={realmData}
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
