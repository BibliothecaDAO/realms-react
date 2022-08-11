import {
  Table,
  Button,
  ResourceIcon,
  Spinner,
  CountdownTimer,
} from '@bibliotheca-dao/ui-lib';
import { formatEther } from '@ethersproject/units';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { DAY, MAX_DAYS_ACCURED } from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { Realm } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useResources, { Entrypoints } from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import type { AvailableResources, RealmsCardProps } from '@/types/index';
import { resources, findResourceName } from '@/util/resources';

type Row = {
  resource: ReactElement;
  // baseOutput: number;
  claimableResources: string | ReactElement;
  // totalOutput: number;
};

type Prop = {
  showRaidable?: boolean;
  showClaimable?: boolean;
  showLevel?: boolean;
  hideLordsClaimable?: boolean;
  hideDaysAccrued?: boolean;
  header?: React.ReactNode;
  availableResources: AvailableResources;
};

export function RealmResources(props: RealmsCardProps & Prop): ReactElement {
  const { claim } = useResources(props.realm as Realm);
  const isOwner = useIsOwner(props.realm?.settledOwner);

  const mappedRowData: Row[] = (props.realm.resources as any).map(
    (re, index) => {
      const mappedData = {
        resource: (
          <span className="flex">
            <ResourceIcon
              resource={
                findResourceName(re.resourceId)?.trait.replace(' ', '') || ''
              }
              size="md"
              className="self-center mr-4"
            />
            <span className="self-center text-lg font-semibold tracking-widest uppercase">
              {re.resourceName || ''}
            </span>
          </span>
        ),
        // baseOutput: 100,
      };
      {
        /* eslint-disable */
      }
      if (props.showClaimable) {
        Object.assign(mappedData, {
          claimableResources: (
            <span className="w-full text-center">
              {(props.availableResources.claimableResources[index] &&
                props.availableResources.claimableResources[index]) || (
                <Spinner size="md" scheme="white" variant="circle" />
              )}
            </span>
          ),
        });
      }
      if (props.showRaidable) {
        Object.assign(mappedData, {
          raidableResources: (
            <span className="w-full text-center">
              {(props.availableResources.vaultResources[index] &&
                props.availableResources.vaultResources[index]) || (
                <Spinner size="md" scheme="white" variant="circle" />
              )}
            </span>
          ),
        });
      }
      return mappedData;
    }
  );

  const txQueue = useTransactionQueue();
  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  useEffect(() => {
    setEnqueuedHarvestTx(
      !!txQueue.transactions.find(
        (t) =>
          t.contractAddress == ModuleAddr.ResourceGame &&
          t.entrypoint == Entrypoints.claim &&
          t.metadata.realmId == props.realm.realmId
      )
    );
  }, [txQueue.transactions]);

  const columns = [
    { Header: 'Resource', id: 1, accessor: 'resource' },
    // { Header: 'Base Output', id: 2, accessor: 'baseOutput' },
    props.showClaimable
      ? { Header: 'Claimable', id: 2, accessor: 'claimableResources' }
      : undefined,
    props.showRaidable
      ? { Header: 'Raidable', id: 3, accessor: 'raidableResources' }
      : undefined,
    props.showLevel ? { Header: 'level', id: 4, accessor: 'level' } : undefined,
  ].filter((i) => i !== undefined);

  const tableOptions = { is_striped: true };

  return (
    <div className="w-full">
      <div className="flex justify-around flex-grow w-full p-4 text-center">
        <div className="w-1/2">
          <h6>days</h6>
          <div className="mt-3 text-5xl font-semibold">
            {props.availableResources.daysAccrued === MAX_DAYS_ACCURED
              ? `${MAX_DAYS_ACCURED}`
              : props.availableResources.daysAccrued}{' '}
            <span className="opacity-50"> / 3</span>
          </div>{' '}
          {props.availableResources.daysAccrued != MAX_DAYS_ACCURED && (
            <div className="flex justify-between px-3 uppercase text-body">
              next day
              <CountdownTimer
                date={(
                  (DAY - props.availableResources.daysRemainder) * 1000 +
                  new Date().getTime()
                ).toString()}
              />
            </div>
          )}
        </div>
        <div className="border-r-4 border-white border-double border-white/30"></div>
        <div className="w-1/2">
          <h6>vault </h6>
          <div className="mt-3 text-5xl font-semibold">
            {props.availableResources.vaultAccrued}
          </div>{' '}
        </div>
      </div>
      {props.header}
      <Table columns={columns} data={mappedRowData} options={tableOptions} />
      {isOwner && (
        <div className="flex w-full mt-4 space-x-3">
          <Button
            disabled={
              enqueuedHarvestTx || props.availableResources.daysAccrued === 0
            }
            size="xs"
            variant="primary"
            className="w-full"
            onClick={() => {
              claim();
            }}
          >
            {props.availableResources.daysAccrued === 0
              ? 'nothing to harvest'
              : 'Harvest Resources'}
          </Button>
        </div>
      )}
    </div>
  );
}
