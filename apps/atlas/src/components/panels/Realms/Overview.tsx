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
  fetchRealmNameById,
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
  const realm = props.realm?.realm;

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
        <Card className="col-span-12 lg:col-start-1 lg:col-end-7">
          <CardBody>
            <div>
              {hasOwnRelic(realm) ? (
                <div>
                  <p className="text-xl">
                    Citizens of {realm?.name} are living peacefully on its
                    lands. The Lord of {realm?.name} is keeping them safe from
                    Goblins and other warmongering realms.
                  </p>
                </div>
              ) : (
                <div>
                  {realm?.relic?.map((a, i) => {
                    return (
                      <div key={i} className="flex flex-wrap mb-4">
                        <div className="relative">
                          <Image
                            src={'/stableai/archanist.png'}
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
                          <h2>
                            Annexed by {fetchRealmNameById(a.heldByRealm || 0)}!
                          </h2>{' '}
                          <p className="text-xl">
                            {realm?.name} has been Conquered by Realm{' '}
                            {fetchRealmNameById(a.heldByRealm || 0)}. The
                            citizens shake in fear everyday thinking it will be
                            their last... won't someone think of the children!
                          </p>
                        </div>
                        <div className="w-full mt-4">
                          <Button
                            href={'/realm/' + a.heldByRealm + '?tab=Army'}
                            variant="outline"
                            size="sm"
                          >
                            see realm {fetchRealmNameById(a.heldByRealm || 0)}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
        <Card className="col-span-12 row-span-3 md:col-span-6 lg:col-start-7 lg:col-span-5 ">
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

        <Card className="col-span-12 row-span-2 sm:col-span-4 lg:col-span-4">
          <div className="w-full p-2 mb-3 text-center uppercase bg-red-800 rounded sm:text-2xl font-display paper animate-pulse">
            {realm && RealmCombatStatus(realm)}!
          </div>

          <div className="my-2">
            {props.realm?.realm.ownArmies.length ? (
              <ArmyCard
                selectedRealm={props.realm?.realm.realmId}
                army={props.realm?.realm.ownArmies[0]}
              />
            ) : (
              'No defending Armies! This Realm is defence less.'
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

        <Card
          loading={props.loading}
          className="col-span-12 sm:col-span-4 lg:col-start-1 lg:col-end-3"
        >
          <CardTitle>Food in Storehouse</CardTitle>
          {!props.loading && (
            <CardStats>
              <div>
                {/* {props.availableFood && (
                  <div className="flex justify-end w-full text-xl">
                    {' '}
                    <CountdownTimer
                      date={(
                        props.availableFood * 1000 +
                        new Date().getTime()
                      ).toString()}
                    />
                  </div>
                )} */}
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
                  props.buildingUtilisation.currentSqm,
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
      </div>
    </BaseRealmDetailPanel>
  );
};

export default Overview;
