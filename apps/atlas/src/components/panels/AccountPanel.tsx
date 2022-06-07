import {
  Button,
  IconButton,
  ResourceIcon,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardStats,
  Donut,
  Table,
} from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown-color.svg';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useJourneyContext } from '@/context/JourneyContext';
import {
  useGetRealmHistoryQuery,
  useGetAccountQuery,
} from '@/generated/graphql';
import { useApproveLordsForBuilding } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { getAccountHex } from '@/shared/Getters/Realm';
import { shortenAddress } from '@/util/formatters';
import { findResourceName } from '@/util/resources';
import { useWalletContext } from '../../hooks/useWalletContext';

import { RealmResources } from '../tables/RealmResources';
// import { BankCard } from './Account/AccountCards';
import { BasePanel } from './BasePanel';

export function AccountPanel() {
  /* const { state, actions } = useJourneyContext(); */
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();
  const { mintRealm } = useSettling();
  const { approveLords, isApproved: isLordsApprovedForBuilding } =
    useApproveLordsForBuilding();
  const { account, connect, connectors, disconnect } = useStarknet();
  const { togglePanelType, toggleMenuType, selectedPanel } = useAtlasContext();

  const [selectedId, setSelectedId] = useState(0);

  const { data: accountData } = useGetAccountQuery({
    variables: { account: account ? getAccountHex(account) : '' },
  });

  function genRealmEvent(event) {
    switch (event.eventType) {
      case 'realm_combat_attack':
        return event.data?.success ? (
          <span className="">
            💰 Raid Successful <br></br> on {event.data?.defendRealmId}
          </span>
        ) : (
          `😞 Unsuccessful Raid`
        );
      case 'realm_combat_defend':
        return event.data?.success ? (
          <span className="">
            💪 Defended Raid from {event.data?.defendRealmId}
          </span>
        ) : (
          <span className="">
            🔥 We have been Pillaged! {event.data?.defendRealmId}
          </span>
        );
      case 'realm_building_built':
        return `🏗️ Built ${event.data?.buildingName}`;
      case 'realm_resource_upgraded':
        return `🏗️ Upgraded ${event.data?.resourceName} to Level ${event.data?.level}`;
      case 'realm_mint':
        return `Minted`;
      case 'realm_settle':
        return '🏘️ Settled';
      case 'realm_unsettle':
        return '🏚️ Unsettled';
      default:
        return '';
    }
  }

  function genRealmAction(event) {
    switch (event.eventType) {
      case 'realm_combat_attack':
        return event.data?.success ? (
          <Button
            size="xs"
            variant="primary"
            href={'/ream/' + event.data?.defendRealmId}
          >
            Pillage again
          </Button>
        ) : (
          <Button
            size="xs"
            variant="primary"
            href={'/ream/' + event.data?.defendRealmId}
          >
            Try again
          </Button>
        );
      case 'realm_combat_defend':
        return event.data?.success ? (
          <Button
            size="xs"
            variant="primary"
            href={'/ream/' + event.data?.attackRealmId}
          >
            Try again
          </Button>
        ) : (
          <Button
            size="xs"
            variant="primary"
            href={'/ream/' + event.data?.attackRealmId}
          >
            ⚔️ Retaliate
          </Button>
        );
      case 'realm_building_built':
        return `Built ${event.data?.buildingName}`;
      case 'realm_resource_upgraded':
        return `Upgraded ${event.data?.resourceName} to Level ${event.data?.level}`;
      case 'realm_mint':
        return 'Ser, welcome';
      case 'realm_settle':
        return 'Ser, welcome';
      case 'realm_unsettle':
        return 'Unsettled';
      default:
        return '';
    }
  }

  const realmEventData = (accountData?.accountHistory ?? [])
    .map((realmEvent) => {
      console.log(accountData?.accountHistory);
      return {
        event: genRealmEvent(realmEvent),
        action: genRealmAction(realmEvent),
      };
    })
    .filter((row) => row.event !== '');

  const tableOptions = { is_striped: true, search: false };
  const columns = [
    { Header: 'Event', id: 1, accessor: 'event' },
    { Header: 'advisor', id: 2, accessor: 'action' },
  ];

  return (
    <BasePanel open={selectedPanel === 'account'}>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-start-1 col-end-7 p-8">
          <h1>Ser, Your Vast Empire</h1>
          <p className="mt-8 text-2xl">
            This is your dashboard for all things happen on your lands.
          </p>
        </div>
        {/* <Donut className='stroke-red-200' radius={90} stroke={10} progress={90}/> */}
        <Card className="col-start-1 col-end-8">
          <CardBody>
            <CardTitle>Events across your empire</CardTitle>
            <Table
              columns={columns}
              data={realmEventData}
              options={tableOptions}
            />
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-5">
          <CardBody>
            <CardTitle>Total Realms</CardTitle>
            <CardStats className="text-5xl">20</CardStats>
            <Button className="mt-10" variant="primary" size="sm" href="/realm">
              See Realms
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-5 col-end-9">
          <CardBody>
            <CardTitle>Total Crypts</CardTitle>
            <CardStats className="text-5xl">20</CardStats>
            <Button className="mt-10" variant="primary" size="sm" href="/crypt">
              See Crypts
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-5">
          <CardBody>
            <CardTitle>Realm Admin</CardTitle>
            <div className="flex w-full mt-10 space-x-2">
              <Button
                variant="primary"
                className="mt-auto ml-8"
                size="sm"
                onClick={() => toggleMenuType('bridgeRealms')}
              >
                Bridge Realms
              </Button>
              <Button
                className="ml-8"
                variant="primary"
                size="sm"
                onClick={() => toggleMenuType('settleRealms')}
              >
                Settle Realms
              </Button>
            </div>
          </CardBody>
        </Card>
        <Card className="col-start-5 col-end-9">
          <CardBody>
            <CardTitle>Resources + Lords</CardTitle>
            {/* <BankCard/> */}
            <Button
              variant="primary"
              size="sm"
              className="mt-auto"
              href="/bank"
            >
              Go to Bank
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-6">
          <CardBody>
            <CardTitle>Mint Test Realms [card only for alpha]</CardTitle>
            <input
              placeholder="Type Id"
              type={'number'}
              className="w-3/12 p-2 mx-auto mb-2 text-black rounded bg-white/80"
              value={selectedId}
              onChange={(e) => {
                setSelectedId(parseInt(e.target.value));
              }}
              min="1"
              max="8000"
            />
            <Button
              className="ml-8"
              variant="primary"
              size="sm"
              onClick={() => mintRealm(selectedId)}
            >
              Mint Realms
            </Button>
          </CardBody>
        </Card>
      </div>
    </BasePanel>
  );
}
