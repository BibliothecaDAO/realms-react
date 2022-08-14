import { Button, Card, CardBody, CardTitle } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { useMemo, useState } from 'react';
import { LoreEntitiesOverview } from '@/components/tables/LoreEntitiesOverview';
import type { GetRealmQuery, LoreEntityWhereInput } from '@/generated/graphql';
import { useGetLoreEntitiesQuery } from '@/generated/graphql';
import { BaseRealmDetailPanel } from './BaseRealmDetailPanel';

type Prop = {
  realm?: GetRealmQuery;
  open: boolean;
};

const RealmLore: React.FC<Prop> = ({ realm, open }) => {
  const limit = 20;
  const [page, setPage] = useState(1);
  const previousPage = () => setPage(page - 1);
  const nextPage = () => setPage(page + 1);

  const variables = useMemo(() => {
    const filter: LoreEntityWhereInput = {};

    filter.revisions = {
      every: {
        pois: {
          some: {
            poiId: {
              equals: 1000,
            },
            assetId: {
              equals: realm?.realm.realmId.toString(),
            },
          },
        },
      },
    };

    return {
      filter,
      take: limit,
      skip: limit * (page - 1),
    };
  }, [page]);

  const { loading, data } = useGetLoreEntitiesQuery({
    variables,
  });

  const showPagination = () =>
    page > 1 || (data?.getLoreEntities?.length ?? 0) === limit;

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

      {showPagination() && (
        <div className="flex gap-2 my-8">
          <Button onClick={previousPage} disabled={page === 1}>
            Previous
          </Button>
          <Button
            onClick={nextPage}
            disabled={data?.getLoreEntities?.length !== limit}
          >
            Next
          </Button>
        </div>
      )}
      {/* </div> */}
      {/* </div> */}
    </BaseRealmDetailPanel>
  );
};

export default RealmLore;
