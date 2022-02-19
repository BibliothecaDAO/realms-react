import React from "react";
import { AppProps } from "next/app";
import { WalletProvider } from "~/hooks/useWalletContext";
import { SoundProvider } from "~/context/soundProvider";
import { UserAgentProvider } from "@quentin-sommer/react-useragent";
import { StarknetProvider } from "@starknet-react/core";
import { UIProvider } from "~/hooks/useUIContext";
import "../styles/index.css";
import PageTransition from "~/components/navigation/PageTransition";
import { animated, Transition } from "@react-spring/web";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms",
  cache: new InMemoryCache(),
});

const PageWrapper = (Comp: any) =>
  class InnerPageWrapper extends React.Component<{ ua: string }> {
    /*
     * Need to use args.ctx
     * See https://nextjs.org/docs/advanced-features/custom-document
     */
    static async getInitialProps(args: any) {
      return {
        ua: args.ctx.req
          ? args.ctx.req.headers["user-agent"]
          : navigator.userAgent,
        ...(Comp.getInitialProps ? await Comp.getInitialProps(args) : null),
      };
    }

    render() {
      const { ua, ...props } = this.props;
      return (
        <UserAgentProvider ua={ua}>
          <Comp {...props} />
        </UserAgentProvider>
      );
    }
  };

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SoundProvider>
      <WalletProvider>
        <ApolloProvider client={client}>
          <StarknetProvider>
            <UIProvider>
              <Component {...pageProps} />

              {/* <PageTransition
                Component={Component}
                pageProps={pageProps}
              ></PageTransition> */}
            </UIProvider>
          </StarknetProvider>
        </ApolloProvider>
      </WalletProvider>
    </SoundProvider>
  );
}

export default PageWrapper(MyApp);
