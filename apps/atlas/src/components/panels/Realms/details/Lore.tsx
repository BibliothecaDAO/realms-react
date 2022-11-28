import { Button, Card, CardBody, CardTitle } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { useMemo, useState } from 'react';
import { LoreEntitiesOverview } from '@/components/tables/LoreEntitiesOverview';
import type { GetRealmQuery, LoreEntityWhereInput } from '@/generated/graphql';
import { useGetLoreEntitiesQuery } from '@/generated/graphql';

export const RealmLore = ({ realm, realmId, realmName }) => {
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
              equals: realmId?.toString(),
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
    <div>
      {loading && (
        <div className="grid grid-cols-1">
          <div className="text-xl">Loading...</div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3">
        <LoreEntitiesOverview entities={data?.getLoreEntities ?? []} />
      </div>

      {hasNoResults() && (
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <CardTitle>No Lore for {realmName} has written yet!</CardTitle>
            <CardBody>
              <div className="mt-2">
                <Button
                  href="/lore"
                  size="xs"
                  className="w-full"
                  variant={'primary'}
                >
                  start writing
                </Button>
              </div>
            </CardBody>
          </div>
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
    </div>
  );
};
