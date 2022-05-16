import { Button, IconButton, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown-color.svg';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { useJourneyContext } from '@/context/JourneyContext';
import useSettling from '@/hooks/settling/useSettling';
import { useUIContext } from '@/hooks/useUIContext';
import { shortenAddress } from '@/util/formatters';
import { findResourceName } from '@/util/resources';
import { useWalletContext } from '../../hooks/useWalletContext';
import { BasePanel } from './BasePanel';

export function AccountPanel() {
  const { state, actions } = useJourneyContext();
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();
  const { mintRealm } = useSettling();
  const { account, connect, connectors, disconnect } = useStarknet();
  const { togglePanelType, toggleMenuType, selectedPanel } = useUIContext();
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
  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <BasePanel open={selectedPanel === 'account'}>
      <div>
        <div className="flex mb-4">
          <h3 className="w-28">Ethereum</h3>
          <span>
            {isConnected && (
              <Button variant="secondary" onClick={disconnectWallet}>
                <Ethereum className="w-4 mx-4" /> {displayName} [ disconnect ]
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
              <Button variant="primary" onClick={() => connect(connectors[0])}>
                <StarkNet className="w-5 mr-2" />
                Connect to StarkNet
              </Button>
            )}
          </span>
        </div>
        <div className="text-xl">
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
            Settle Realms
          </Button>
          <h2 className="mt-12">Claims</h2>
          <h3>Resources</h3>
          <div className="flex flex-wrap font-semibold tracking-widest uppercase">
            {resourceIds.map((re: any, index) => (
              <div
                key={index}
                className="flex p-1 mb-4 mr-4 text-xl border rounded bg-gray-800/70 hover:bg-gray-500/70"
              >
                <ResourceIcon
                  resource={
                    findResourceName(re.id)?.trait?.replace(' ', '') || ''
                  }
                  size="sm"
                />

                <span className="self-center ml-1 text-sm">
                  {findResourceName(re.id)?.trait}:
                </span>
                <span className="self-center mr-2 text-sm">{re.amount}</span>
              </div>
            ))}
          </div>
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
        </div>
      </div>
    </BasePanel>
  );
}
