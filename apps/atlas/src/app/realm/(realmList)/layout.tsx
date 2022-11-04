import React from 'react';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { ArtBackground } from '@/components/map/ArtBackground';
import { BasePanel } from '@/components/panels/BasePanel';
import { getStarkNetId } from '@/lib/starknet/getStarkNetId';
import RealmsListTabs from '../RealmsListTabs';

export default async function RealmLayout({ children, params }) {
  return (
    <>
      <BasePanel open={true}>
        <div className="flex flex-wrap justify-between px-3 pt-16 sm:px-6">
          <h1>Realms</h1>
          <div className="w-full my-1 sm:w-auto">
            <SearchFilter
              placeholder="SEARCH BY ID"
              /* onSubmit={(value) => {
                actions.updateSearchIdFilter(parseInt(value) ? value : '');
              }}
              defaultValue={state.searchIdFilter + ''} */
            />
          </div>
        </div>
        <RealmsListTabs />

        <section>{children}</section>
      </BasePanel>
      <ArtBackground background="realm" />
    </>
  );
}
