import { UserAgent } from "@quentin-sommer/react-useragent";
import { UserAgentProps } from "@quentin-sommer/react-useragent/dist/UserAgent";
import { AbstractConnectorArguments } from "@web3-react/types";

import { walletconnect, injected } from "../connectors";

type Prop = {
  children: (connector: AbstractConnectorArguments) => React.ReactNode;
};

const UserAgentConnector: React.FC<Prop> = (props) => {
  return (
    <UserAgent>
      {(ua: UserAgentProps) => {
        if (ua.chrome) {
          return props.children(injected);
        }
        return props.children(walletconnect);
      }}
    </UserAgent>
  );
};

export default UserAgentConnector;
