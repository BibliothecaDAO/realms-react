import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardStats,
  CardIcon,
  Donut,
  CountdownTimer,
} from '@bibliotheca-dao/ui-lib';
import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';

import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';
import { UserAgent } from '@quentin-sommer/react-useragent';
import { useStarknetCall } from '@starknet-react/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSpring } from 'react-spring';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { toBN } from 'starknet/utils/number';
import { RealmCard } from '@/components/cards/RealmCard';
import { RealmHistory } from '@/components/tables/RealmHistory';
import { RealmResources } from '@/components/tables/RealmResources';
import type { Realm, RealmFragmentFragment } from '@/generated/graphql';
import { useGetTroopStatsQuery, useGetRealmQuery } from '@/generated/graphql';
import useBuildings from '@/hooks/settling/useBuildings';
import useFood from '@/hooks/settling/useFood';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useRealmDetailHotkeys from '@/hooks/settling/useRealmDetailHotkeys';
import useResources from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import useKeyPress from '@/hooks/useKeyPress';
import { RealmOwner, RealmStatus, TraitTable } from '@/shared/Getters/Realm';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
import SidebarHeader from '@/shared/SidebarHeader';
import { dummySquad, dummyDefenceSquad } from '@/shared/squad/DummySquad';
import { SquadBuilder } from '@/shared/squad/Squad';
import { shortenAddress } from '@/util/formatters';
import { findResourceName } from '@/util/resources';
import { RealmBuildings } from '../tables/RealmBuildings';
import Army from './RealmDetails/Army';
import ResourceDetails from './RealmDetails/Resources';
import Survey from './RealmDetails/Survey';
import RealmToolbar from './RealmDetails/Toolbar';

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

  const { buildings, buildingUtilisation } = useBuildings(realm as Realm);
  const { realmFoodDetails, availableFood } = useFood(realm as Realm);
  const { realmsResourcesDetails } = useResources({
    token_id: realm?.realmId,
    resources: realm?.resources,
  });

  const { subview, set } = useRealmDetailHotkeys(
    router.query['tab'] as Subview
  );

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
    console.log(value);
    if (!loading) {
      router.push('/realm/' + value, undefined, { shallow: true });
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
    <>
      <div className="absolute z-20 grid w-full h-full overflow-auto bg-cover">
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
              className={`w-40 h-40 rounded-full ${color} flex justify-center align-middle text-black bg-opacity-70 shadow-2xl`}
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
                  {subview == 'Army' && (
                    <Army
                      open={subview == 'Army'}
                      availableResources={realmsResourcesDetails}
                      buildings={buildings}
                      realm={realmData?.realm}
                    />
                  )}
                  {subview == 'Resources' && (
                    <ResourceDetails
                      open={subview == 'Resources'}
                      availableResources={realmsResourcesDetails}
                      realmFoodDetails={realmFoodDetails}
                      availableFood={availableFood}
                      buildings={buildings}
                      realm={realmData}
                    />
                  )}
                  {subview == 'Survey' && (
                    <Survey
                      open={subview == 'Survey'}
                      availableResources={realmsResourcesDetails}
                      buildingUtilisation={buildingUtilisation}
                      realmFoodDetails={realmFoodDetails}
                      availableFood={availableFood}
                      buildings={buildings}
                      realm={realmData}
                    />
                  )}

                  {subview == 'History' && <RealmHistory realmId={realmId} />}
                </>
              ) : null}
            </div>
          </div>

          {/*
        <div className="grid grid-flow-col grid-cols-6 gap-6 py-4">
          <div className="col-start-1 col-end-5 row-span-3">
            <Image
              src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${realmId}.webp`}
              alt="map"
              className="w-full mt-4 rounded-xl -scale-x-100"
              width={500}
              height={320}
              layout={'responsive'}
            />
          </div>
          <Card className="col-start-5 col-end-7">
            <CardTitle>Owner</CardTitle>
            <CardStats className="text-2xl">
              {shortenAddress(RealmOwner(realm as RealmFragmentFragment))}
            </CardStats>
          </Card>
          <Card className="col-start-5 col-end-7">
            <CardTitle>Realm State</CardTitle>
            {realm && (
              <CardStats className="text-2xl">{RealmStatus(realm)}</CardStats>
            )}
          </Card>
          <Card className="col-start-5 col-end-7 text-white">
            <CardTitle>Vulnerable in</CardTitle>
            <CountdownTimer date={time()} />
          </Card>
          <Card className="col-start-1 col-end-3 ">
            <CardTitle>Traits</CardTitle>
            <div className="w-full my-2 text-white">
              <TraitTable
                trait="Region"
                traitAmount={getTrait(realm, 'Region')}
              />
            </div>
            <div className="w-full my-2 text-white">
              <TraitTable trait="City" traitAmount={getTrait(realm, 'City')} />
            </div>
            <div className="w-full my-2 text-white">
              <TraitTable
                trait="Harbor"
                traitAmount={getTrait(realm, 'Harbor')}
              />
            </div>
            <div className="w-full my-2 text-white">
              <TraitTable
                trait="River"
                traitAmount={getTrait(realm, 'River')}
              />
            </div>
          </Card>
          <Card className="col-start-3 col-end-7 ">
            <CardTitle>Resources</CardTitle>
            {realm && <RealmResources realm={realm} loading={false} />}
          </Card>


          <Card className="col-start-1 col-end-7">
            <div className="flex justify-between w-full mb-10">
              <div className="text-2xl font-semibold tracking-widest text-white uppercase">
                Military Strength
              </div>
              <div className="text-xl font-semibold tracking-widest text-white uppercase ">
                {squad ? <span>Attacking</span> : <span>Defending</span>} Squad
                <Button
                  className="ml-4"
                  variant="secondary"
                  size="xs"
                  onClick={() => setSquad(!squad)}
                >
                  change
                </Button>
              </div>
            </div>
            {squad ? (
              <SquadBuilder
                location={1}
                realmId={realmId}
                withPurchase={true}
                troops={attackSquad}
                troopsStats={troopStatsData?.getTroopStats}
              />
            ) : (
              <SquadBuilder
                location={2}
                realmId={realmId}
                withPurchase={true}
                troops={defenseSquad}
                troopsStats={troopStatsData?.getTroopStats}
              />
            )}
          </Card>
          <Card className="col-start-1 col-end-3 ">
            <CardTitle>Happiness</CardTitle>
            <CardStats className="text-4xl">100</CardStats>
          </Card>
          <Card className="col-start-3 col-end-4 ">
            <CardTitle>Culture</CardTitle>
            <CardStats className="text-4xl">{getCulture()}</CardStats>
          </Card>
          <Card className="col-start-4 col-end-5 ">
            <CardTitle>Food</CardTitle>
            <CardStats className="text-4xl">{getFood()}</CardStats>
          </Card>
          <Card className="col-start-5 col-end-7 ">
            <CardTitle>Population</CardTitle>
            <CardStats className="text-4xl">{getPopulation()}</CardStats>
          </Card>
          <Card className="col-start-1 col-end-7 ">
            <CardTitle>Buildings</CardTitle>
            {realm && <RealmBuildings realm={realm} loading={false} />}
          </Card>
        </div>
        */}
        </div>
      </div>
    </>
  );
}
