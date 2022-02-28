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
        // TODO: Remove user-agent based connector filtering
        //       Since wallets like Frame can inject the providers
        //       and browser extensions do that also
        if (true) {
          return props.children([
            { name: "Injected", connector: injected },
            wc,
          ]);
        }
      }}
    </UserAgent>
  );
};

export default UserAgentConnector;
