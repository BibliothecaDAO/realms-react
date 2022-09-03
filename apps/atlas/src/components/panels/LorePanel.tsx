import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { useStarknet } from '@starknet-react/core';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
// import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { hexToDecimalString } from 'starknet/dist/utils/number';
import { LoreCreateEntityForm } from '@/components/panels/LoreComponents/LoreCreateEntityForm';
import { LoreEntitiesOverview } from '@/components/tables/LoreEntitiesOverview';
import { useLoreContext } from '@/context/LoreContext';
import type { LoreEntityWhereInput } from '@/generated/graphql';
import {
  GetLoreEntitiesQueryVariables,
  RealmTraitType,
  useGetLoreEntitiesLazyQuery,
  useGetLoreEntitiesQuery,
  useGetRealmsQuery,
} from '@/generated/graphql';
// import { useAtlasContext } from '@/hooks/useAtlas';
import { useWalletContext } from '@/hooks/useWalletContext';
import { SearchFilter } from '../filters/SearchFilter';
import { BasePanel } from './BasePanel';

export const LorePanel = () => {
  const router = useRouter();

  // const { setModal } = useAtlasContext();
  const { account } = useWalletContext();
  const { account: starknetAccount } = useStarknet();
  const { state, actions } = useLoreContext();

  // Filters
  const [searchByContent, setSearchByContent] = useState('');
  const [searchByAuthor, setSearchByAuthor] = useState('');

  // Pagination
  const limit = 20;
  const [page, setPage] = useState(1);
  const previousPage = () => setPage(page - 1);
  const nextPage = () => setPage(page + 1);

  // Reset page on filter change. UseEffect doesn't do a deep compare
  useEffect(() => {
    setPage(1);
  }, [state.selectedTab]);

  const isLorePanel = true;
  const tabs = ['All Scrolls', 'Your Scrolls', 'Create'];

  const variables = useMemo(() => {
    const filter: LoreEntityWhereInput = {};

    if (state.selectedTab == 1 && starknetAccount) {
      filter.owner = { equals: hexToDecimalString(starknetAccount) };
    }

    if (searchByContent) {
      filter.revisions = {
        every: {
          OR: [
            { title: { contains: searchByContent } },
            { excerpt: { contains: searchByContent } },
            { markdown: { contains: searchByContent } },
          ],
        },
      };
    }

    if (searchByAuthor) {
      filter.ownerDisplayName = { contains: searchByAuthor };
    }

    return {
      filter,
      take: limit,
      skip: limit * (page - 1),
    };
  }, [account, state, page, searchByContent, searchByAuthor]);

  const [resyncEntities, { data, loading }] = useGetLoreEntitiesLazyQuery({
    variables,
  });

  useEffect(() => {
    resyncEntities();

    // Open Modal if the path is: /lore/{id}-some-slugged-header-for-ux
    if (
      router.query.segment &&
      router.query.segment.length >= 2 &&
      router.query.segment[0] === 'lore'
    ) {
      const spl = router.query.segment[1].split('-');

      if (spl.length > 0) {
        const id = parseInt(spl[0], 10) || 1;

        // TODO
        // setModal({
        //   type: 'lore-entity',
        //   props: { id },
        // });
      }
    }
  }, []);

  const showPagination = () =>
    state.selectedTab != 2 &&
    (page > 1 || (data?.getLoreEntities?.length ?? 0) === limit);

  const hasNoResults = () =>
    !loading && (data?.getLoreEntities?.length ?? 0) === 0;

  return (
    <BasePanel
      open={isLorePanel}
      // style={clsx({ 'lg:w-7/12': state.selectedTab !== 2 })}
    >
      <div className="flex justify-between">
        <div className="w-full p-10 pt-20 bg-black/90">
          <h2 className="w-full">Lore</h2>
          <p className="mt-4 sm:text-xl opacity-70">
            Write stories about your favourite Realms, Loot Bags, GA, and more!
          </p>
        </div>
      </div>
      <Tabs
        selectedIndex={state.selectedTab}
        onChange={actions.updateSelectedTab as any}
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab} className="uppercase">
              {tab}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <div className="h-full px-2 bg-black">
        {state.selectedTab !== 2 && (
          <div className="flex flex-wrap justify-between mb-2 ">
            <div className="grid grid-cols-2 gap-2">
              <SearchFilter
                placeholder="Search by content"
                onSubmit={(value) => {
                  setSearchByContent(value);
                }}
                defaultValue={searchByContent}
              />
              <SearchFilter
                placeholder="Search by author"
                onSubmit={(value) => {
                  setSearchByAuthor(value);
                }}
                defaultValue={searchByAuthor}
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Castle className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        {state.selectedTab === 2 && <LoreCreateEntityForm />}

        {state.selectedTab !== 2 && (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <LoreEntitiesOverview entities={data?.getLoreEntities ?? []} />
          </div>
        )}

        {/* don't show feedback and menu at the "create" tab */}
        {hasNoResults() && state.selectedTab != 2 && (
          <div className="flex flex-col items-center justify-center gap-8 my-8">
            <h2>No results.</h2>
            <div className="flex gap-4">
              <Button
                variant="primary"
                className="whitespace-nowrap"
                onClick={actions.clearFilters}
              >
                Clear Filters
              </Button>
              {state.selectedTab !== 1 && (
                <Button
                  className="whitespace-nowrap"
                  variant="primary"
                  onClick={() => actions.updateSelectedTab(1)}
                >
                  See All Realms
                </Button>
              )}
            </div>
          </div>
        )}

        {showPagination() && (
          <div className="flex gap-2 my-8">
            <Button
              variant="primary"
              onClick={previousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={nextPage}
              disabled={data?.getLoreEntities?.length !== limit}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </BasePanel>
  );
};
