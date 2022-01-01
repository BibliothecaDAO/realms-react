import { UserAgent } from "@quentin-sommer/react-useragent";
import { UserAgentProps } from "@quentin-sommer/react-useragent/dist/UserAgent";
import { AbstractConnectorArguments } from "@web3-react/types";

import { walletconnect, injected } from "../connectors";

type Prop = {
  children: (
    connectors: { name: string; connector: AbstractConnectorArguments }[]
  ) => React.ReactNode;
};

const UserAgentConnector: React.FC<Prop> = (props) => {
  const wc = { name: "WalletConnect", connector: walletconnect };
  return (
    <UserAgent>
      {(ua: UserAgentProps) => {
        if (ua.chrome) {
          return props.children([
            { name: "MetaMask", connector: injected },
            wc,
          ]);
        }
        return props.children([wc]);
      }}
    </UserAgent>
  );
};

export default UserAgentConnector;
