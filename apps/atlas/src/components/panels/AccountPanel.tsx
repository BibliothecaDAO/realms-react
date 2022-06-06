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
import { useEffect, useState } from 'react';
import { useJourneyContext } from '@/context/JourneyContext';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { useApproveLordsForBuilding } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import { useAtlasContext } from '@/hooks/useAtlasContext';
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

  const { data: historyData2 } = useGetRealmHistoryQuery({
    variables: {
      filter: {
        realmOwner: {
          equals:
            '0x00e07fec8e00eaf66056cd57355ca3e51042524b29a18542fde1df7148f5a00f',
        },
      },
    },
  });

  function genRealmEvent(event) {
    switch (event.eventType) {
      case 'realm_combat_attack':
        return event.data?.success
          ? `💰 Raid Successful`
          : `😞 Unsuccessful Raid`;
      case 'realm_combat_defend':
        return event.data?.success ? (
          <span className="">💪 Defended Raid from</span>
        ) : (
          <span className="">🔥 We have been Pillaged!</span>
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
          <Button size="xs" variant="primary" href={'/ream/'}>
            Pillage again
          </Button>
        ) : (
          <Button size="xs" variant="primary" href={'/ream/'}>
            try again
          </Button>
        );
      case 'realm_combat_defend':
        return event.data?.success ? (
          <Button size="xs" variant="primary" href={'/ream/'}>
            Try again
          </Button>
        ) : (
          <Button size="xs" variant="primary" href={'/ream/'}>
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

  const realmEventData = (historyData2?.getRealmHistory ?? [])
    .map((realmEvent) => {
      console.log(historyData2?.getRealmHistory);
      return {
        event: genRealmEvent(realmEvent),
        action: genRealmAction(realmEvent),
      };
    })
    .filter((row) => row.event !== '');

  const tableOptions = { is_striped: true, search: false };
  const columns = [
    { Header: 'Event', id: 1, accessor: 'event' },
    { Header: 'action', id: 2, accessor: 'action' },
  ];

  return (
    <BasePanel open={selectedPanel === 'account'}>
      <div className="grid grid-cols-12 gap-8">
        <div className="flex col-start-1 col-end-6 space-x-2">
          <span>
            {isConnected && (
              <Button size="sm" variant="secondary" onClick={disconnectWallet}>
                <Ethereum className="w-4 mx-4" /> {displayName} [ disconnect ]
              </Button>
            )}
            {!isConnected && (
              <Button size="sm" variant="primary" onClick={connectWallet}>
                <Ethereum className="w-4 mr-4" /> Connect
              </Button>
            )}
          </span>
          <span>
            {account ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => disconnect(connectors[0])}
              >
                <StarkNet className="w-5 mr-2" />
                {shortenAddress(account)} [ disconnect ]
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={() => connect(connectors[0])}
              >
                <StarkNet className="w-5 mr-2" />
                Connect to StarkNet
              </Button>
            )}
          </span>
        </div>

        <div className="col-start-1 col-end-7 p-8">
          <h1>Ser, Your Vast Empire</h1>
          <p className="mt-8 text-2xl">
            This is your dashboard for all things happen on your lands.
          </p>
        </div>
        {/* <Donut className='stroke-red-200' radius={90} stroke={10} progress={90}/> */}

        {/* <Card className="col-start-6 col-end-9">
          <CardBody>
            <CardTitle>lords</CardTitle>
            <CardStats>100m</CardStats>
            <Button
              variant="primary"
              size="sm"
              className="ml-auto"
              onClick={() => connect(connectors[0])}
            >
              Claim
            </Button>
          </CardBody>
        </Card> */}
        <Card className="col-start-9 col-end-13 row-span-3">
          <CardBody>
            <CardTitle>Needing your attention</CardTitle>
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

        {/* <div className="text-xl">
          <h2>Realms</h2>
          <p>You have: 42 Realms</p>
          <p className="mb-2">
            L1 Realms: 12
            <Button
              variant="primary"
              className="ml-8"
              size="sm"
              onClick={() => toggleMenuType('bridgeRealms')}
            >
              Bridge Realms
            </Button>
          </p>
          <p className="mb-2">
            L2 Realms unsettled: 20
            <Button
              className="ml-8"
              variant="primary"
              size="sm"
              onClick={() => toggleMenuType('settleRealms')}
            >
              Settle Realms
            </Button>
          </p>
          <p>L2 Realms Settled: 10</p>
          <h4>Mint Realms</h4>
          <input
            placeholder="Type Id"
            type={'number'}
            className="w-3/12 px-4 py-4 text-black rounded-l bg-white/80"
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
          <h2 className="mt-12">Claims</h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => connect(connectors[0])}
          >
            Claim Resources
          </Button>
          <h3 className="mt-6 mb-3">Lords</h3>
          <div className="flex align-items-center">
            <span className="flex px-4 text-4xl text-center">
              <Lords className="w-12 mr-4" />
              {balance}
            </span>
            <div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => connect(connectors[0])}
              >
                Claim Lords
              </Button>
            </div>
          </div>
          <h2>Approval Status</h2>
          {isLordsApprovedForBuilding ? 'Approved' : 'Not Approved'}
          {!isLordsApprovedForBuilding && (
            <Button variant="primary" size="sm" onClick={() => approveLords()}>
              Approve Lords for Building contract
            </Button>
          )}
          <h2 className="mt-12">Troops & Raiding</h2>
          <p>In the last week:</p>
          <p>
            You have been raided X times, losing A Resources and B Troops{' '}
            <Button
              variant="primary"
              size="sm"
              onClick={() => connect(connectors[0])}
            >
              View Raids
            </Button>
          </p>
          <p>
            X Watchmen, Y Knights & Z Catapults have finished building{' '}
            <Button
              variant="primary"
              size="sm"
              onClick={() => connect(connectors[0])}
            >
              View Troops
            </Button>
          </p>
        </div> */}
      </div>
    </BasePanel>
  );
}
