import { Table, Button, ResourceIcon, Spinner } from '@bibliotheca-dao/ui-lib';
import { formatEther } from '@ethersproject/units';
import type { ReactElement } from 'react';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
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
  const { realmsResourcesDetails } = useResources({
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
          <span className="flex">
            <ResourceIcon
              resource={
                findResourceName(re.resourceId)?.trait.replace(' ', '') || ''
              }
              size="md"
              className="mr-4"
            />
            <span className="self-center text-xl font-semibold tracking-widest uppercase">
              {re.resourceName || ''}
            </span>
          </span>
        ),
        // baseOutput: 100,
        level: re.level,
      };
      {
        /* eslint-disable */
      }
      if (props.showClaimable) {
        Object.assign(mappedData, {
          claimableResources: (
            <span className="w-full text-center">
              {(realmsResourcesDetails.claimableResources[index] &&
                realmsResourcesDetails.claimableResources[index]) || (
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
              {(realmsResourcesDetails.vaultResources[index] &&
                realmsResourcesDetails.vaultResources[index]) || (
                <Spinner size="md" scheme="white" variant="circle" />
              )}
            </span>
          ),
        });
      }
      return mappedData;
    }
  );

  /* const txQueue = useTransactionQueue();

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
*/
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
      <div className="flex justify-between p-2 text-2xl">
        <div>
          Days: {realmsResourcesDetails.daysAccrued} /
          {realmsResourcesDetails.daysRemainder}s
        </div>
        <div>
          Vault: {realmsResourcesDetails.vaultAccrued} /
          {realmsResourcesDetails.vaultRemainder}s
        </div>
      </div>

      <Table columns={columns} data={mappedRowData} options={tableOptions} />
    </div>
  );
}
