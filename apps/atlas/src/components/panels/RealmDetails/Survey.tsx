import { Card, CardTitle, CardStats } from '@bibliotheca-dao/ui-lib/base';
import React from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import type { GetRealmQuery } from '@/generated/graphql';
import { TraitTable } from '@/shared/Getters/Realm';

type Prop = {
  realm?: GetRealmQuery;
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
    <>
      <div className="grid grid-flow-col grid-cols-6 gap-6 py-4">
        <Card className="col-start-1 col-end-3 ">
          <CardTitle>Traits</CardTitle>
          <div className="w-full my-2 ">
            <TraitTable
              trait="Region"
              traitAmount={getTrait(realm, 'Region')}
            />
          </div>
          <div className="w-full my-2 ">
            <TraitTable trait="City" traitAmount={getTrait(realm, 'City')} />
          </div>
          <div className="w-full my-2 ">
            <TraitTable
              trait="Harbor"
              traitAmount={getTrait(realm, 'Harbor')}
            />
          </div>
          <div className="w-full my-2 ">
            <TraitTable trait="River" traitAmount={getTrait(realm, 'River')} />
          </div>
        </Card>
        <Card className="col-start-3 col-end-5 ">
          <CardTitle>Resources</CardTitle>
          {realm && <RealmResources realm={realm} loading={false} />}
        </Card>
        {/* <Card className="col-start-1 col-end-3 ">
          <CardTitle>Happiness</CardTitle>
          <CardStats className="text-4xl">100</CardStats>
        </Card>
        <Card className="col-start-3 col-end-4 ">
          <CardTitle>Culture</CardTitle>
          <CardStats className="text-4xl">{getCulture()}</CardStats>
        </Card>
        <Card className="col-start-5 col-end-7 ">
          <CardTitle>Population</CardTitle>
          <CardStats className="text-4xl">{getPopulation()}</CardStats>
        </Card> */}
      </div>
    </>
  );
};

export default Survey;
