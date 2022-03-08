import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { WalletProvider } from "~/hooks/useWalletContext";
import { SoundProvider } from "~/context/soundProvider";
import { UserAgentProvider } from "@quentin-sommer/react-useragent";
import { StarknetProvider } from "@starknet-react/core";
import { UIProvider } from "~/hooks/useUIContext";
import "../styles/index.css";
import PageTransition from "~/components/navigation/PageTransition";
import { animated, Transition } from "@react-spring/web";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";
import { concatPagination } from "@apollo/client/utilities";

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  useQuery,
  gql,
} from "@apollo/client";
import { BreakpointProvider } from "~/hooks/useBreakPoint";

const client = new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: {
        realms:
          "https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms",
        crypts: "https://api.thegraph.com/subgraphs/name/redbeardeth/lootdev",
        ecosystem:
          "https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/loot-ecosystem",
      },
      httpSuffix: "",
      createHttpLink: () => createHttpLink(),
    }),
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          realms: concatPagination(["where", "orderBy"]),
          bridgedRealms: concatPagination(["where", "orderBy"]),
          dungeons: concatPagination(["where"]),
        },
      },
    },
  }),
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
const queries = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BreakpointProvider queries={queries}>
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
    </BreakpointProvider>
  );
}

export default PageWrapper(MyApp);
