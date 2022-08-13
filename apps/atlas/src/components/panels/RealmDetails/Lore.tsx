import { Button, Card, CardBody, CardTitle } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { LoreEntitiesOverview } from '@/components/tables/LoreEntitiesOverview';
import type { GetRealmQuery } from '@/generated/graphql';
import { useGetLoreEntitiesQuery } from '@/generated/graphql';
import { BaseRealmDetailPanel } from './BaseRealmDetailPanel';

type Prop = {
  realm?: GetRealmQuery;
  open: boolean;
};

const RealmLore: React.FC<Prop> = ({ realm, open }) => {
  const { loading, data } = useGetLoreEntitiesQuery({
    variables: {
      filter: {
        id: { equals: realm?.realm.realmId },
      },
    },
  });

  const hasNoResults = () =>
    !loading && (data?.getLoreEntities?.length ?? 0) === 0;

  return (
    <BaseRealmDetailPanel open={open}>
      {/* <div className="grid grid-cols-12 gap-6"> */}
      {/* <div className="col-span-12 col-start-1 col-end-12 flex"> */}
      {loading && (
        <div className="grid grid-cols-12 gap-6 py-4">
          <Card className="col-start-1 col-end-7">
            <CardBody className="text-center">
              <Castle className="block w-20 fill-current mx-auto" />
              <div className="text-4xl">Loading...</div>
            </CardBody>
          </Card>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <LoreEntitiesOverview entities={data?.getLoreEntities ?? []} />
      </div>
      {hasNoResults() && (
        <div className="grid grid-cols-12 gap-6 py-4">
          <Card className="col-start-1 col-end-7">
            <CardTitle>
              No Lore for {realm?.realm.name} has written yet!
            </CardTitle>
            <CardBody>
              Want to be the first?
              <div className="mt-2">
                <Button
                  href="/lore"
                  size="lg"
                  className="w-full"
                  variant={'primary'}
                >
                  Start writing Lore for {realm?.realm.name}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
      {/* </div> */}
      {/* </div> */}
    </BaseRealmDetailPanel>
  );
};

export default RealmLore;
