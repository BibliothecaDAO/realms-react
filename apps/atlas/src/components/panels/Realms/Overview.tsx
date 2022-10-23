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
import { ArmyCard } from '@/components/cards/realms/ArmyCard';
import { RealmResources } from '@/components/tables/RealmResources';
import { STORE_HOUSE_SIZE } from '@/constants/buildings';
import type { GetRealmQuery } from '@/generated/graphql';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useIsOwner from '@/hooks/useIsOwner';
import {
  TraitTable,
  hasOwnRelic,
  RealmCombatStatus,
  getTrait,
} from '@/shared/Getters/Realm';
import TerrainLayer from '@/shared/Terrain';
import type {
  RealmFoodDetails,
  BuildingFootprint,
  BuildingDetail,
} from '@/types/index';
import { BaseRealmDetailPanel } from './BaseRealmDetailPanel';
import { RealmImage } from './details/Image';

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
          <div className="w-full p-2 mb-3 text-center uppercase bg-gray-800 rounded sm:text-2xl font-display paper">
            {realm && RealmCombatStatus(realm)}!
          </div>
          <div className="my-2">
            {props.realm?.realm.ownArmies.length ? (
              <ArmyCard
                selectedRealm={props.realm?.realm.realmId}
                army={props.realm?.realm.ownArmies[0]}
              />
            ) : (
              'No armies! This Realm is defenceless.'
            )}
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
                    <div key={i} className="flex flex-wrap mb-4">
                      <div className="relative">
                        <Image
                          src={'/stableai/arcanist.png'}
                          alt="map"
                          height={150}
                          width={150}
                          className="w-24 h-24 mr-10 border shadow-2xl md:w-48 md:h-48 border-white/20 card paper"
                        />
                        <div className="absolute top-0 px-2 text-xl font-semibold border bg-black/30 border-white/20 font-lords ">
                          1
                        </div>
                      </div>
                      <div>
                        <h2>Annexed by Realm {a.heldByRealm}</h2>{' '}
                        <p className="text-xl">
                          {realm?.name} has been Conquered by Realm{' '}
                          {a.heldByRealm}. The citizens shake in fear everyday
                          thinking it will be their last... won't someone think
                          of the children!
                        </p>
                      </div>
                      <div className="w-full mt-4">
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
        <Card
          loading={props.loading}
          className="col-span-12 lg:col-start-1 lg:col-end-4 "
        >
          <CardTitle>Land Used</CardTitle>
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
          <RealmImage id={realm?.realmId} />
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
