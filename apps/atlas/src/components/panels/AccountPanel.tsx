import {
  Button,
  IconButton,
  ResourceIcon,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardStats,
} from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown-color.svg';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { useJourneyContext } from '@/context/JourneyContext';
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
  const resourceIds = [
    { id: 1, amount: 120 },
    { id: 3, amount: 90 },
    { id: 6, amount: 130 },
    { id: 12, amount: 120 },
    { id: 15, amount: 520 },
    { id: 18, amount: 20 },
    { id: 22, amount: 10 },
  ];
  const [selectedId, setSelectedId] = useState(0);

  return (
    <BasePanel open={selectedPanel === 'account'}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-start-1 col-end-6">
          <h1>Ser, Your Empire</h1>
        </div>
        <Card className="col-start-1 col-end-6 text-white">
          <CardBody>
            <CardTitle>Ser, your empire</CardTitle>
            <div className="flex mb-4 ">
              <h3 className="w-28">Ethereum</h3>
              <span>
                {isConnected && (
                  <Button variant="secondary" onClick={disconnectWallet}>
                    <Ethereum className="w-4 mx-4" /> {displayName} [ disconnect
                    ]
                  </Button>
                )}
                {!isConnected && (
                  <Button variant="primary" onClick={connectWallet}>
                    <Ethereum className="w-4 mr-4" /> Connect
                  </Button>
                )}
              </span>
            </div>
            <div className="flex mb-12">
              <h3 className="w-28">Starknet</h3>
              <span>
                {account ? (
                  <Button
                    variant="secondary"
                    onClick={() => disconnect(connectors[0])}
                  >
                    <StarkNet className="w-5 mr-2" />
                    {shortenAddress(account)} [ disconnect ]
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => connect(connectors[0])}
                  >
                    <StarkNet className="w-5 mr-2" />
                    Connect to StarkNet
                  </Button>
                )}
              </span>
            </div>
          </CardBody>
        </Card>
        <Card className="col-start-6 col-end-9">
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
        </Card>
        <Card className="col-start-9 col-end-13 row-span-3">
          <CardBody>
            <CardTitle>Needing your attention</CardTitle>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-4">
          <CardBody>
            <CardTitle>Bridge Realms</CardTitle>
            <Button
              variant="primary"
              className="ml-8"
              size="sm"
              onClick={() => toggleMenuType('bridgeRealms')}
            >
              Bridge Realms
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-4 col-end-6">
          <CardBody>
            <CardTitle>Realms Settled</CardTitle>
            <CardStats>9</CardStats>
          </CardBody>
        </Card>
        <Card className="col-start-6 col-end-9 row-span-2">
          <CardBody>
            <CardTitle>Resources</CardTitle>
            {/* <BankCard/> */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => connect(connectors[0])}
            >
              Claim Empires Resources
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-6">
          <CardBody>
            <CardTitle>Mint Realms</CardTitle>
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
