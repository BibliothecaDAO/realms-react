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
import type { GetRealmQuery } from '@/generated/graphql';
import useIsOwner from '@/hooks/useIsOwner';
import { TraitTable, squadStats } from '@/shared/Getters/Realm';
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
  availableFood: number | undefined;
  availableResources: AvailableResources;
  open: boolean;
  loading: boolean;
};

const Survey: React.FC<Prop> = (props) => {
  const getTrait = (realm: any, trait: string) => {
    return realm?.traits?.find((o) => o.type === trait)
      ? realm.traits?.find((o) => o.type === trait).qty
      : '0';
  };
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

  return (
    <BaseRealmDetailPanel open={props.open}>
      <div className="grid grid-cols-12 gap-6 py-4">
        <Card
          loading={props.loading}
          className="col-span-12 md:col-start-1 md:col-end-3 "
        >
          <CardTitle>Population</CardTitle>
          <CardStats className="text-4xl">
            {props.realmFoodDetails.population}
          </CardStats>
        </Card>
        <Card
          loading={props.loading}
          className="col-span-12 md:col-start-3 md:col-end-5 "
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
            <Button variant="outline" size="xs">
              manage
            </Button>
          )}
        </Card>
        <Card className="col-span-12 md:col-start-5 md:col-end-8 ">
          <CardTitle>Military Strength</CardTitle>
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
            <Button variant="outline" size="xs">
              manage
            </Button>
          )}
        </Card>
        <Card className="col-span-12 row-span-2 md:col-start-8 md:col-end-13 ">
          <CardTitle>Landscape of {realm?.name}</CardTitle>{' '}
          <Image
            src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${realm?.realmId}.webp`}
            alt="map"
            className="w-full -scale-x-100"
            width={500}
            height={320}
            layout={'responsive'}
          />
          <CardTitle>Realm Traits</CardTitle>
          <CardBody>
            <div className="flex flex-wrap">
              <div className="p-1 my-1 sm:w-1/2">
                <TraitTable
                  trait="Region"
                  traitAmount={getTrait(realm, 'Region')}
                />
              </div>
              <div className="p-1 my-1 sm:w-1/2 ">
                <TraitTable
                  trait="City"
                  traitAmount={getTrait(realm, 'City')}
                />
              </div>
              <div className="p-1 my-1 sm:w-1/2 ">
                <TraitTable
                  trait="Harbor"
                  traitAmount={getTrait(realm, 'Harbor')}
                />
              </div>
              <div className="p-1 my-1 sm:w-1/2 ">
                <TraitTable
                  trait="River"
                  traitAmount={getTrait(realm, 'River')}
                />
              </div>
            </div>
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
          className="col-span-12 md:col-start-1 md:col-end-4 "
        >
          <CardTitle>Building</CardTitle>

          <CardBody>
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
          </CardBody>
          <CardStats className="flex justify-between text-2xl">
            <h5>sqm used</h5>
            {props.buildingUtilisation &&
              props.buildingUtilisation.currentSqm}/{' '}
            {props.buildingUtilisation && props.buildingUtilisation.maxSqm}
          </CardStats>
        </Card>
        <Card
          loading={props.loading}
          className="col-span-12 md:col-start-4 md:col-end-8 "
        >
          <CardTitle>Resources</CardTitle>
          <CardBody>
            {realm && (
              <RealmResources
                showClaimable
                showRaidable
                availableResources={props.availableResources}
                realm={realm}
                loading={false}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </BaseRealmDetailPanel>
  );
};

export default Survey;
