import {
  Card,
  CardTitle,
  CardStats,
  CardBody,
  Button,
  CountdownTimer,
} from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import React from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import { RealmBuildingId, STORE_HOUSE_SIZE } from '@/constants/buildings';
import type { GetRealmQuery } from '@/generated/graphql';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useIsOwner from '@/hooks/useIsOwner';
import {
  TraitTable,
  squadStats,
  RealmVaultStatus,
  hasOwnRelic,
  RealmCombatStatus,
  getTrait,
} from '@/shared/Getters/Realm';
import TerrainLayer from '@/shared/Terrain';
import type {
  BuildingDetail,
  RealmFoodDetails,
  BuildingFootprint,
  AvailableResources,
} from '@/types/index';
import { BaseRealmDetailPanel } from './BaseRealmDetailPanel';

type Prop = {
  realm?: GetRealmQuery;
  buildingUtilisation: BuildingFootprint | undefined;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
  onSetSubview: (string: Subview) => void;
  availableFood: number | undefined;
  open: boolean;
  loading: boolean;
};

const Overview: React.FC<Prop> = (props) => {
  const getPopulation = () => {
    return realm?.buildings
      ?.map((a) => a.population)
      .reduce((prev, curr) => prev + curr, 0);
  };

  const getCulture = () => {
    return realm?.buildings
      ?.map((a) => a.culture)
      .reduce((prev, curr) => prev + curr, 0);
  };

  const realm = props.realm?.realm;

  const attackingSquad = realm?.troops?.filter((a) => a.squadSlot === 1);
  const defensiveSquad = realm?.troops?.filter((a) => a.squadSlot === 2);

  const isOwner = useIsOwner(realm?.settledOwner);

  const cropLand = ({ level, color, built }) => {
    return Array.from({ length: level }, (item, index) => (
      <div className="m-0.5" key={index}>
        <div
          className={`h-2 p-2 border border-white/40 rounded ${
            index < built ? color : ''
          }`}
        ></div>
      </div>
    ));
  };

  return (
    <BaseRealmDetailPanel open={props.open}>
      <div className="grid grid-cols-12 gap-6 py-4">
        <Card
          loading={props.loading}
          className="col-span-12 sm:col-span-4 lg:col-span-2"
        >
          <CardTitle>Population</CardTitle>
          <CardStats className="text-4xl">
            {props.realmFoodDetails.population}
          </CardStats>
        </Card>
        <Card
          loading={props.loading}
          className="col-span-12 sm:col-span-4 lg:col-span-2"
        >
          <CardTitle>Food in Storehouse</CardTitle>
          {!props.loading && (
            <CardStats>
              <div>
                {props.availableFood && (
                  <div className="flex justify-end w-full text-xl">
                    {' '}
                    <CountdownTimer
                      date={(
                        props.availableFood * 1000 +
                        new Date().getTime()
                      ).toString()}
                    />
                  </div>
                )}
                <div className="text-4xl">
                  {props.availableFood?.toLocaleString()}
                </div>{' '}
              </div>
            </CardStats>
          )}
          {isOwner && (
            <Button
              onClick={() => props.onSetSubview('Food')}
              variant="outline"
              size="xs"
            >
              manage
            </Button>
          )}
        </Card>
        <Card className="col-span-12 sm:col-span-4 lg:col-span-3">
          <CardTitle>Military Strength</CardTitle>
          <div className="w-full text-center uppercase sm:text-2xl">
            {realm && RealmCombatStatus(realm)}
          </div>
          <div className="flex justify-around flex-grow w-full p-4 text-center">
            <div>
              <h5>Attacking</h5>
              <div className="pt-3 text-5xl font-semibold">
                {squadStats(attackingSquad).attack}
              </div>
            </div>
            <div className="border-r-4 border-white border-double border-white/30"></div>
            <div>
              <h5>Defending</h5>
              <div className="pt-3 text-5xl font-semibold text-5xll">
                {squadStats(defensiveSquad).attack}
              </div>
            </div>
          </div>
          {isOwner && (
            <Button
              onClick={() => props.onSetSubview('Army')}
              variant="outline"
              size="xs"
            >
              manage
            </Button>
          )}
        </Card>
        <Card className="col-span-12 lg:col-start-8 lg:col-end-13">
          <CardBody>
            {hasOwnRelic(realm) ? (
              <div>
                <h2>Not conquered!</h2>
                <p className="text-xl">
                  Citizens of {realm?.name} are living peacefully on its lands.
                  The Lord of {realm?.name} is keeping them safe from Goblins
                  and other warmongering realms.
                </p>
              </div>
            ) : (
              <div>
                {realm?.relic?.map((a, i) => {
                  return (
                    <div key={i} className="mb-4">
                      <h2>Conquered by Realm {a.heldByRealm}</h2>{' '}
                      <p className="text-xl">
                        {realm?.name} has been Conquered by Realm{' '}
                        {a.heldByRealm}. The citizens shake in fear everyday
                        thinking it will be their last... won't someone think of
                        the children!
                      </p>
                      <div className="mt-4">
                        <Button
                          href={'/realm/' + a.heldByRealm + '?tab=Army'}
                          variant="outline"
                          size="sm"
                        >
                          Visit realm {a.heldByRealm}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* <Card
          loading={props.loading}
          className="col-span-12 row-span-2 md:col-start-8 md:col-end-13"
        >
          <CardTitle>{realm?.name} history</CardTitle>
          <CardBody className="text-2xl">
            Loot is a collaborative media project that aims to create a
            decentralized, infinitely-expansive sci-fantasy universe, rich with
            stories, games and multi-media. The Lootverse is a collection of NFT
            projects, games, art, stories and multimedia backed by an active
            community of players, builders, artists, writers and creators.
          </CardBody>
          <div className="pt-4 mt-auto">
            <Button variant="outline">write an entry</Button>
          </div>
        </Card> */}
        <Card
          loading={props.loading}
          className="col-span-12 lg:col-start-1 lg:col-end-4 "
        >
          <CardTitle>Used Sqm</CardTitle>

          <CardBody>
            <div className="flex flex-wrap">
              {cropLand({
                level:
                  props.buildingUtilisation && props.buildingUtilisation.maxSqm,
                color: 'bg-green-800',
                built:
                  props.buildingUtilisation &&
                  props.availableFood &&
                  props.buildingUtilisation.currentSqm +
                    props.availableFood / STORE_HOUSE_SIZE,
              })}
            </div>
            {/* <div className="mt-3">
              {props.buildings?.map((a, i) => {
                return (
                  <div key={i} className="flex justify-between font-semibold">
                    <span>{a.name}</span>{' '}
                    <span>
                      {a.quantityBuilt} - {a.sqmUsage} sqm
                    </span>
                  </div>
                );
              })}
            </div> */}
          </CardBody>
          <CardStats className="flex justify-between px-4 text-4xl">
            {props.buildingUtilisation && props.buildingUtilisation.currentSqm}/{' '}
            {props.buildingUtilisation && props.buildingUtilisation.maxSqm}
          </CardStats>
        </Card>
        <Card
          loading={props.loading}
          className="col-span-12 row-span-1 md:col-span-6 lg:col-start-4 lg:col-span-4"
        >
          <CardTitle>Resources</CardTitle>
          <CardBody>
            {realm && (
              <RealmResources
                showClaimable
                showRaidable
                realm={realm}
                loading={false}
              />
            )}
          </CardBody>
        </Card>
        <Card className="col-span-12 row-span-1 md:col-span-6 lg:col-start-8 lg:col-span-5 ">
          <div className="rounded h-96">
            <TerrainLayer />
          </div>

          <CardBody>
            <div className="flex grid grid-cols-2 gap-4 font-display">
              <div className="my-1 ">
                <TraitTable
                  trait="Region"
                  traitAmount={getTrait(realm, 'Region')}
                />
              </div>
              <div className="my-1 ">
                <TraitTable
                  trait="City"
                  traitAmount={getTrait(realm, 'City')}
                />
              </div>
              <div className="my-1 ">
                <TraitTable
                  trait="Harbor"
                  traitAmount={getTrait(realm, 'Harbor')}
                />
              </div>
              <div className="my-1 ">
                <TraitTable
                  trait="River"
                  traitAmount={getTrait(realm, 'River')}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </BaseRealmDetailPanel>
  );
};

export default Overview;
