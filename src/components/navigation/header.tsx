import { useWalletContext } from "../../hooks/useWalletContext";

export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();

  return (
    <div className="top-10 absolute z-20 left-2 flex">
      <div className="ml-auto">
        <ul className="flex space-x-4 mr-auto text-xl backdrop-blur-md bg-off-200/20 px-4 py-4 rounded">
          <li className="">
            {isConnected && (
              <span>
                <span className="px-4">LORDS: {balance}</span>

                <a
                  className={
                    "cursor-pointer  font-body p-4  bg-off-200/20 text-off-100 rounded ml-auto py-2"
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
                  "cursor-pointer  font-body p-4  bg-off-200/20 text-off-100 rounded  ml-auto py-2"
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
  );
}
