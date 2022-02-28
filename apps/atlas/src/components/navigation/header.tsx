/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useWalletContext } from '../../hooks/useWalletContext';

export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();

  return (
    <div>
      <h1 className="absolute top-0 z-10 w-full pt-8 text-6xl text-center">
        Atlas
      </h1>
      <div className="absolute z-20 hidden left-14 top-8 sm:flex">
        <div className="ml-auto">
          <ul className="flex px-4 py-4 mr-auto space-x-4 text-xl rounded backdrop-blur-md bg-off-200/20">
            <li className="">
              {isConnected && (
                <span>
                  <span className="px-4">LORDS: {balance}</span>

                  <a
                    className={
                      'cursor-pointer  font-body p-4  bg-off-200/20 text-off-100 rounded ml-auto py-2'
                    }
                    onClick={disconnectWallet}
                  >
                    {displayName} [ disconnect ]
                  </a>
                </span>
              )}
              {!isConnected && (
                <button
                  className={
                    'cursor-pointer  font-body p-4  bg-off-200/20 text-off-100 rounded  ml-auto py-2'
                  }
                  onClick={connectWallet}
                >
                  Connect to Lootverse
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
