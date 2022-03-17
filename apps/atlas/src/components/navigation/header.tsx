/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from '@bibliotheca-dao/ui-lib';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { useWalletContext } from '../../hooks/useWalletContext';
export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();

  return (
    <div className="top-0 left-0 z-40 hidden bg-gray-700/80 sm:flex justify-end shadow-inner">
      <div className="ml-auto flex px-4 py-4 mr-auto space-x-4 w-full justify-end">
        <span>
          <Button variant="primary" onClick={connectWallet}>
            claim Resources
          </Button>
        </span>
        <span>
          <Button variant="primary" onClick={connectWallet}>
            <Lords className="w-6" /> <span className="px-4">{balance}</span> |
            claim lords
          </Button>
        </span>
        <span>
          {isConnected && (
            <Button variant="secondary" onClick={disconnectWallet}>
              {displayName} [ disconnect ]
            </Button>
          )}
          {!isConnected && (
            <Button variant="primary" onClick={connectWallet}>
              Connect to Lootverse
            </Button>
          )}
        </span>
      </div>
    </div>
  );
}
