import { useUiState } from "../../hooks/useUiState";
import { useWalletContext } from "../../hooks/useWalletContext";

export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();

  const {ui, setUi} = useUiState()

  return (
    <div className="top-0 absolute z-20 p-3 bg-black w-full  border-off-200 text-white border-double border-b-4 flex">
      <nav className="flex text-2xl font-display mr-auto space-x-5">
        <button onClick={() => {
          const newState = {resources: !ui.resources}
          console.log(newState)
          setUi(newState)
        }}>🔨 Resources</button>
        <a href="">🗺️ World Map</a>
      </nav>
      <nav className="flex space-x-6 text-2xl font-display mx-auto ">

        <a href="">Hyperverse</a>
      </nav>
      
      <div className="ml-auto">
        <ul className="flex space-x-4 mr-auto">
          <li className="">
            {isConnected && (
              <span>
                <span className="px-4">LORDS: {balance}</span>
              
                <a
                className={"cursor-pointer  font-body px-4  bg-off-200 text-off-100 rounded  ml-auto py-1"}
                  onClick={disconnectWallet}
                >
                  {displayName}{" "}
                  [ disconnect ]
                </a>
              </span>
            )}
            {!isConnected && (
              <button
                className={"cursor-pointer  font-body px-4  bg-off-200 text-off-100 rounded  ml-auto py-1"}
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
