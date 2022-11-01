'use client';

import { Tabs, Button } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { useAccount } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import type { ReactElement } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { SelectableRealm } from '@/components/tables/SelectableRealm';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import useSettling from '@/hooks/settling/useSettling';
import { useSelections } from '@/hooks/useSelectable';
import AtlasSideBar from './AtlasSideBar';
import { BaseSideBarPanel } from './BaseSideBarPanel';

type RealmsSelectableProps = {
  realms?: RealmFragmentFragment[];
  selectedTab: number;
  onChange: (values: number[]) => void;
};

function RealmsSelectable(props: RealmsSelectableProps): ReactElement {
  const { isSelected, selections, toggleSelection } = useSelections<number>();
  useEffect(() => {
    props.onChange(selections);
  }, [selections.length]);

  return (
    <div>
      {props.realms?.map((realm: RealmFragmentFragment, index) => (
        <SelectableRealm
          key={index}
          realm={realm}
          onSelect={toggleSelection}
          isSelected={isSelected(realm.realmId)}
        />
      ))}
    </div>
  );
}

interface SettleRealmsSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const SettleRealmsSideBar = ({
  isOpen,
  onClose,
}: SettleRealmsSideBarProps) => {
  return (
    <AtlasSideBar isOpen={isOpen} containerClassName="w-full lg:w-5/12">
      {isOpen && <SettleRealmsSideBarPanel onClose={onClose} />}
    </AtlasSideBar>
  );
};

/* TBD Should this be merged with Bridge Realms Sidebar */
export const SettleRealmsSideBarPanel = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  const { address } = useAccount();

  const starknetWallet = address ? BigNumber.from(address).toHexString() : '';

  const { settleRealm, unsettleRealm, isRealmsApproved, approveRealms } =
    useSettling();

  const [settleSelections, setSettleSelections] = useState<number[]>([]);
  const [unSettleSelections, setUnSettleSelections] = useState<number[]>([]);

  const limit = 50;
  const [page, setPage] = useState(1);

  const variables = useMemo(() => {
    const filter = {} as any;
    filter.OR = [
      { ownerL2: { equals: starknetWallet } },
      { settledOwner: { equals: starknetWallet } },
    ];

    return {
      filter,
      take: limit,
      skip: limit * (page - 1),
    };
  }, [starknetWallet, page]);

  const [selectedTab, setSelectedTab] = useState(0);

  const { data, loading } = useGetRealmsQuery({
    variables,
  });

  const tabs = useMemo(
    () => [
      {
        label: 'Settle',
        component: (
          <RealmsSelectable
            selectedTab={selectedTab}
            realms={data?.realms?.filter(
              (realm) => realm.ownerL2 == starknetWallet
            )}
            onChange={(values) => {
              setSettleSelections([...values]);
            }}
          />
        ),
      },
      {
        label: 'Unsettle',
        component: (
          <RealmsSelectable
            selectedTab={selectedTab}
            realms={data?.realms?.filter(
              (realm) => realm.settledOwner == starknetWallet
            )}
            onChange={(values) => {
              setUnSettleSelections([...values]);
            }}
          />
        ),
      },
    ],
    [data?.realms, selectedTab, isRealmsApproved]
  );

  const settleAll = () => {
    settleSelections.forEach((a) => {
      settleRealm(a);
    });
  };

  const usSettleAll = () => {
    unSettleSelections.forEach((a) => {
      unsettleRealm(a);
    });
  };

  return (
    <BaseSideBarPanel title="Settle Realms" onClose={onClose}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => setSelectedTab(index as number)}
        variant="primary"
      >
        <Tabs.List className="">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.label} className="uppercase">
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels>
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>

      <div className="w-full">
        {/* Remove when needed  */}
        {/* {isRealmsApproved != 'approved' && (
            <Button
              className="w-full"
              variant="primary"
              onClick={() => approveRealms()}
            >
              Approve Realms for Settling
            </Button>
          )} */}
        {isRealmsApproved == 'approved' && (
          <Button
            className="w-full"
            variant="primary"
            onClick={() => (selectedTab === 0 ? settleAll() : usSettleAll())}
          >
            {selectedTab === 0 ? 'Settle Realms' : 'Unsettle Realms'}
          </Button>
        )}
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
