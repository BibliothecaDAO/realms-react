import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useMemo } from 'react';
import { SelectableRealm } from '@/components/tables/SelectableRealm';
import type {
  RealmFragmentFragment,
  RealmWhereInput,
} from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useSelections } from '@/hooks/useSelectable';
import { useWalletContext } from '@/hooks/useWalletContext';
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
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <BaseSideBarPanel title="Bridge Realms" onClose={onClose}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => setSelectedTab(index as number)}
        variant="default"
      >
        <Tabs.List className="">
          <Tabs.Tab key={0} className="uppercase">
            StarkNet (L2)
          </Tabs.Tab>
          <Tabs.Tab key={1} className="uppercase">
            Ethereum (L1)
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel key={0}>
            <L2Realms setSelectedTab={setSelectedTab} />
          </Tabs.Panel>
          <Tabs.Panel key={1}>
            <L1Realms setSelectedTab={setSelectedTab} />
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </BaseSideBarPanel>
  );
};

const L1Realms = ({
  setSelectedTab,
}: {
  setSelectedTab?: Dispatch<SetStateAction<number>>;
}) => {
  const { account } = useWalletContext();

  const limit = 50;
  const [page, setPage] = useState(1);

  const variables = useMemo(() => {
    const filter = {} as RealmWhereInput;

    filter.OR = [
      { owner: { equals: account?.toLowerCase() } },
      // { bridgedOwner: { equals: account?.toLowerCase() } },
    ];

    return {
      filter,
      take: limit,
      skip: limit * (page - 1),
    };
  }, [account, page]);

  const { setSelections, toggleSelection, isSelected, selections } =
    useSelections<number>();

  const toggleSelectAllRealms = () =>
    selections.length > 0
      ? setSelections([])
      : setSelections((data?.realms || []).map((realm) => realm.realmId));

  const { data, loading } = useGetRealmsQuery({
    variables,
  });

  return (
    <>
      <div className="flex justify-between mb-6">
        <div>
          {data && data.realms && data.realms.length > 0 && (
            <div className="w-full">
              <Button
                className="w-full"
                variant={selections.length > 0 ? 'primary' : 'outline'}
                onClick={() => null}
                disabled={selections.length === 0}
              >
                Bridge to StarkNet (L2)
              </Button>
            </div>
          )}
        </div>
        <div>
          <Button variant="secondary" size="sm" onClick={toggleSelectAllRealms}>
            {selections.length > 0 ? `Deselect All` : `Select All`}
          </Button>
        </div>
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

      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Castle className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )}

      {account && data && data.realms && data.realms.length === 0 && (
        <div className="flex flex-col items-center gap-2 mx-auto my-10 text-gray-600">
          <h3>All Realms are bridged to StarkNet (L2)</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedTab && setSelectedTab(0)}
          >
            Switch tab to StarkNet (L2)
          </Button>
        </div>
      )}

      {!account && (
        <div className="flex flex-col items-center gap-2 mx-auto my-10 text-gray-600">
          <h3>Connect your Ethereum wallet...</h3>
        </div>
      )}
    </>
  );
};

const L2Realms = ({
  setSelectedTab,
}: {
  setSelectedTab?: Dispatch<SetStateAction<number>>;
}) => {
  const { account } = useStarknet();

  const limit = 100;
  const [page, setPage] = useState(1);

  const starknetWallet = account ? BigNumber.from(account).toHexString() : '';

  const variables = useMemo(() => {
    const filter = {} as RealmWhereInput;

    filter.OR = [
      { ownerL2: { equals: starknetWallet } },
      { settledOwner: { equals: starknetWallet } },
    ];

    return {
      filter,
      take: limit,
      skip: limit * (page - 1),
    };
  }, [account, page]);

  const { setSelections, toggleSelection, isSelected, selections } =
    useSelections<number>();

  // eslint-disable-next-line sonarjs/no-identical-functions
  const toggleSelectAllRealms = () =>
    selections.length > 0
      ? setSelections([])
      : setSelections((data?.realms || []).map((realm) => realm.realmId));

  const { data, loading } = useGetRealmsQuery({
    variables,
  });

  return (
    <>
      <div className="flex justify-between mb-6">
        <div>
          {data && data.realms && data.realms.length > 0 && (
            <div className="w-full">
              <Button
                className="w-full"
                variant={selections.length > 0 ? 'primary' : 'outline'}
                onClick={() => null}
                disabled={selections.length === 0}
              >
                Bridge to Ethereum (L1)
              </Button>
            </div>
          )}
        </div>
        <div>
          <Button variant="secondary" size="sm" onClick={toggleSelectAllRealms}>
            {selections.length > 0 ? `Deselect All` : `Select All`}
          </Button>
        </div>
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

      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Castle className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )}

      {account && data && data.realms && data.realms.length === 0 && (
        <div className="flex flex-col items-center gap-2 mx-auto my-10 text-gray-600">
          <h3>All Realms are bridged to Ethereum (L1)</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedTab && setSelectedTab(0)}
          >
            Switch tab to Ethereum (L1)
          </Button>
        </div>
      )}

      {!account && (
        <div className="flex flex-col items-center gap-2 mx-auto my-10 text-gray-600">
          <h3>Connect your StarkNet Account...</h3>
        </div>
      )}
    </>
  );
};
