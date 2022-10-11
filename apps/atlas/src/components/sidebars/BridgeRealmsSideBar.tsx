import { Button } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { useState, useMemo } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { SelectableRealm } from '@/components/tables/SelectableRealm';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useSelections } from '@/hooks/useSelectable';
import AtlasSideBar from './AtlasSideBar';
import { BaseSideBarPanel } from './BaseSideBarPanel';

interface BridgeRealmsSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const BridgeRealmsSideBar = ({
  isOpen,
  onClose,
}: BridgeRealmsSideBarProps) => {
  return (
    <AtlasSideBar isOpen={isOpen} containerClassName="w-full lg:w-5/12">
      {isOpen && <BridgeRealmsSideBarPanel onClose={onClose} />}
    </AtlasSideBar>
  );
};

export const BridgeRealmsSideBarPanel = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  const { address: l1Address } = useL1Account();
  const limit = 50;
  const [page, setPage] = useState(1);

  const variables = useMemo(() => {
    const filter = {} as any;

    filter.OR = [{ owner: { equals: l1Address?.toLowerCase() } }];

    return {
      filter,
      take: limit,
      skip: limit * (page - 1),
    };
  }, [l1Address, page]);

  const { data, loading } = useGetRealmsQuery({
    variables,
  });
  const { setSelections, toggleSelection, isSelected, selections } =
    useSelections();

  const toggleSelectAllRealms = () =>
    setSelections((data?.realms || []).map((realm) => realm.realmId));

  return (
    <BaseSideBarPanel title="Bridge Realms" onClose={onClose}>
      <div className="flex justify-end mb-6">
        <Button variant="secondary" size="sm" onClick={toggleSelectAllRealms}>
          {selections.length > 0 ? `Deselect All` : `Select All`}
        </Button>
      </div>
      {data &&
        data.realms &&
        data.realms.map((realm: RealmFragmentFragment, index) => (
          <SelectableRealm
            key={index}
            realm={realm}
            onSelect={toggleSelection}
            isSelected={isSelected(realm.realmId)}
          />
        ))}
      <div className="w-full">
        <Button className="w-full" variant="primary" onClick={() => null}>
          Bridge Realms
        </Button>
      </div>
      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Castle className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )}
    </BaseSideBarPanel>
  );
};
