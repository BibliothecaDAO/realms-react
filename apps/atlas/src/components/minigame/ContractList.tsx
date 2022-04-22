import { toBN } from 'starknet/dist/utils/number';
import { useModuleAddress } from '@/hooks/useModuleAddress';
import { ExternalLink } from '@/shared/Icons';
import LoadingSkeleton from '@/shared/LoadingSkeleton';
import { getHostname } from '@/util/blockExplorer';
import {
  CONTROLLER_ADDRESS,
  ELEMENTS_ADDRESS,
  starknetNetwork,
} from '@/util/minigameApi';
import { moduleIds } from './constants';
import type { ModuleSpec } from './constants';

export const ModuleListItem = (props: ModuleSpec) => {
  const moduleIdInt = toBN(props.id).toString();
  const module = useModuleAddress(moduleIdInt);
  return <ContractListItem name={props.name} address={module.data} />;
};

export const ContractListItem = (props: { name: string; address?: string }) => {
  return (
    <div className="flex justify-between py-4">
      {props.name}{' '}
      {props.address ? (
        <span className="hover:text-gray-300">
          <a
            target={'_blank'}
            className="underline"
            href={`https://${getHostname(starknetNetwork)}/contract/${
              props.address
            }#readContract`}
            rel="noreferrer"
          >
            {props.address?.substring(0, 8) || '-'}...
            {props.address?.substring(props.address?.length - 6)}
          </a>{' '}
          <ExternalLink className="inline-block w-4" />
        </span>
      ) : (
        <LoadingSkeleton className="w-32 h-4" />
      )}
    </div>
  );
};

const ContractList = () => {
  const moduleList = moduleIds.map((m) => <ModuleListItem key={m.id} {...m} />);

  return (
    <div className="my-4">
      <h3>Arbiter-Controller-Modules</h3>
      <p>
        The Starknet contracts for the Desiege game are within the authority of
        a smart contract called the Arbiter.
      </p>
      <p className="mb-2">
        Only the Arbiter contract can invoke functions on the Module Controller.
        Through the Controller, the Arbiter can appoint new Modules, manage
        module-to-module write permissions, and appoint a new Arbiter.
      </p>
      <hr />
      <div className="flex justify-between mt-4">
        <h3>Contract Name</h3>
        <h3>Open in Voyager</h3>
      </div>
      <ContractListItem name="Module Controller" address={CONTROLLER_ADDRESS} />
      {moduleList}
      <h3>Other contracts</h3>
      <ContractListItem
        name="Element Token [ERC-1155]"
        address={ELEMENTS_ADDRESS}
      />
    </div>
  );
};

export default ContractList;
