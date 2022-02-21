import { useWalletContext } from "../../hooks/useWalletContext";

export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();

  return (
    <div>
      <h1 className="text-6xl top-0 absolute z-10 w-full text-center pt-8">
        Atlas
      </h1>
      <div className="left-14 top-8 absolute z-20 sm:flex hidden">
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
    </div>
  );
}
