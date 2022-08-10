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
import { TraitTable } from '@/shared/Getters/Realm';
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
  return (
    <BaseRealmDetailPanel open={props.open}>
      <div className="grid grid-cols-12 gap-6 py-4">
        <Card className="col-span-12 md:col-start-1 md:col-end-3 ">
          <CardTitle>Population</CardTitle>
          <CardStats className="text-4xl">
            {props.realmFoodDetails.population}
          </CardStats>
        </Card>
        <Card className="col-span-12 md:col-start-3 md:col-end-5 ">
          <CardTitle>Food in Storehouse</CardTitle>
          {!props.loading && (
            <CardStats className="text-4xl">
              <div>
                {props.availableFood?.toLocaleString()} <br />
                {props.availableFood && props?.availableFood > 0 ? (
                  <CountdownTimer
                    date={(
                      props.availableFood * 1000 +
                      new Date().getTime()
                    ).toString()}
                  />
                ) : (
                  <span className="text-red-600 animate-pulse">
                    Serfs are starving!
                  </span>
                )}
              </div>
            </CardStats>
          )}
        </Card>
        <Card className="col-span-12 md:col-start-5 md:col-end-8 ">
          <CardTitle>Building usage</CardTitle>

          <CardBody>
            {props.buildings?.map((a, i) => {
              return (
                <div key={i} className="flex justify-between">
                  <span>{a.name}</span>{' '}
                  <span>
                    {a.quantityBuilt} {a.sqmUsage}
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
        <Card className="col-span-12 row-span-2 md:col-start-8 md:col-end-13">
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
        </Card>
        <Card className="col-span-12 md:col-start-1 md:col-end-4 ">
          {' '}
          <Image
            src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${realm?.realmId}.webp`}
            alt="map"
            className="w-full -scale-x-100"
            width={500}
            height={320}
            layout={'responsive'}
          />
        </Card>
        <Card className="col-span-12 md:col-start-4 md:col-end-8 ">
          <CardTitle>Resources</CardTitle>
          <CardBody>
            {realm && (
              <RealmResources
                availableResources={props.availableResources}
                realm={realm}
                loading={false}
              />
            )}
          </CardBody>
        </Card>
        <Card className="col-span-12 md:col-start-1 md:col-end-3 ">
          <CardTitle>Traits</CardTitle>
          <CardBody>
            <div className="w-full my-1 ">
              <TraitTable
                trait="Region"
                traitAmount={getTrait(realm, 'Region')}
              />
            </div>
            <div className="w-full my-1 ">
              <TraitTable trait="City" traitAmount={getTrait(realm, 'City')} />
            </div>
            <div className="w-full my-1 ">
              <TraitTable
                trait="Harbor"
                traitAmount={getTrait(realm, 'Harbor')}
              />
            </div>
            <div className="w-full my-1 ">
              <TraitTable
                trait="River"
                traitAmount={getTrait(realm, 'River')}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </BaseRealmDetailPanel>
  );
};

export default Survey;
