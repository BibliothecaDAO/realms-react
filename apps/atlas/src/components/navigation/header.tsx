/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from '@bibliotheca-dao/ui-lib';
import { useWalletContext } from '../../hooks/useWalletContext';

export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();

  return (
    <div className="top-0 left-0 z-40 hidden bg-gray-400 sm:flex">
      <div className="ml-auto">
        <ul className="flex px-4 py-4 mr-auto space-x-4 text-xl rounded backdrop-blur-md bg-off-200/20">
          <li className="">
            {isConnected && (
              <Button size="lg" variant="primary" onClick={disconnectWallet}>
                <span className="px-4">LORDS: {balance}</span>
                {displayName} [ disconnect ]
              </Button>
            )}
            {!isConnected && (
              <Button
                className={
                  'cursor-pointer  font-body p-4  bg-off-200/20 text-off-100 rounded  ml-auto py-2'
                }
                variant="primary"
                onClick={connectWallet}
              >
                Connect to Lootverse
              </Button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
