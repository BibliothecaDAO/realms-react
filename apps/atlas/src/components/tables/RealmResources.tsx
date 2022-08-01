import { Table, Button, ResourceIcon, Spinner } from '@bibliotheca-dao/ui-lib';
import { formatEther } from '@ethersproject/units';
import type { ReactElement } from 'react';
import useResources from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import { resources, findResourceName } from '@/util/resources';

import type { RealmsCardProps } from '../../types';

type Row = {
  resource: ReactElement;
  // baseOutput: number;
  claimableResources: string | ReactElement;
  // totalOutput: number;
  level: number;
  build: ReactElement;
};

type Prop = {
  showRaidable?: boolean;
  showClaimable?: boolean;
  showLevel?: boolean;
  hideLordsClaimable?: boolean;
  hideDaysAccrued?: boolean;
  header?: React.ReactNode;
};

export function RealmResources(props: RealmsCardProps & Prop): ReactElement {
  const {
    availableResources,
    raidableVault,
    claim,
    upgrade,
    claimableLords,
    claimableResources,
    loadingClaimable,
  } = useResources({
    token_id: props.realm.realmId,
    resources: props.realm.resources,
  });

  const isOwner = useIsOwner(props.realm?.ownerL2);

  const mappedRowData: Row[] = (props.realm.resources as any).map(
    (re, index) => {
      const resourceId =
        resources.find((res) => res.trait === re.type)?.id || 0;
      const mappedData = {
        resource: (
          <span className="flex w-48">
            <ResourceIcon
              resource={
                findResourceName(re.resourceId)?.trait.replace(' ', '') || ''
              }
              size="sm"
              className="mr-4"
            />
            <span className="self-center font-semibold tracking-widest uppercase">
              {re.resourceName || ''}
            </span>
          </span>
        ),
        // baseOutput: 100,
        level: re.level,
        build: isOwner && (
          <Button
            variant="secondary"
            onClick={() => upgrade(resourceId)}
            size="xs"
          >
            Upgrade
          </Button>
        ),
      };
      if (props.showClaimable) {
        Object.assign(mappedData, {
          claimableResources: (claimableResources[index] &&
            formatEther(claimableResources[index].toString(10))) || (
            <Spinner size="md" scheme="white" variant="bricks" />
          ),
        });
      }
      if (props.showRaidable) {
        Object.assign(mappedData, {
          raidableResources: (raidableVault[index] &&
            formatEther(raidableVault[index].toString(10))) || (
            <Spinner size="md" scheme="white" variant="bricks" />
          ),
        });
      }
      return mappedData;
    }
  );


  const txQueue = useTransactionQueue();

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
      ? { Header: 'Claimable Resources', id: 2, accessor: 'claimableResources' }
      : undefined,
    props.showRaidable
      ? { Header: 'Raidable Resources', id: 3, accessor: 'raidableResources' }
      : undefined,
    props.showLevel ? { Header: 'level', id: 4, accessor: 'level' } : undefined,
  ].filter((i) => i !== undefined);

  const tableOptions = { is_striped: true };
  return (
    <div className="w-full">
      <div className="flex justify-between p-2 text-white uppercase">
        {!props.hideLordsClaimable && (
          <span className="flex flex-col">
            <span> Claimable Lords:</span>

            <span className="text-3xl">
              {' '}
              {claimableLords ? (
                formatEther(claimableLords.toString(10))
              ) : (
                <Spinner
                  className="ml-4"
                  size="md"
                  scheme="white"
                  variant="bricks"
                />
              )}
            </span>
          </span>
        )}
        {!props.hideLordsClaimable && (
          <span className="flex flex-col">
            <span>Days Accrued: </span>
            <span className="text-3xl">{availableResources.daysAccrued}D</span>
          </span>
        )}
        {props.header}
      </div>
      <Table columns={columns} data={mappedRowData} options={tableOptions} />
    </div>
  );
}
