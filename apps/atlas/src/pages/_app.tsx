import { ApolloProvider } from '@apollo/client';
import { UserAgentProvider } from '@quentin-sommer/react-useragent';
import {
  StarknetProvider,
  getInstalledInjectedConnectors,
} from '@starknet-react/core';
import type { AppProps } from 'next/app';
import React from 'react';
import { Toaster, ToastBar } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'starknet';
import { TransactionQueueProvider } from '@/context/TransactionQueueContext';
import { BreakpointProvider } from '@/hooks/useBreakPoint';
import { WalletProvider } from '@/hooks/useWalletContext';
import '../styles/global.css';
import apolloClient from '@/util/apolloClient';
/* import PageTransition from '@/components/navigation/PageTransition'; 
import { animated, Transition } from '@react-spring/web'; */

// Create a react-query client
const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PageWrapper = (Comp: any) =>
  class InnerPageWrapper extends React.Component<{ ua: string }> {
    /*
     * Need to use args.ctx
     * See https://nextjs.org/docs/advanced-features/custom-document
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async getInitialProps(args: any) {
      return {
        ua: args.ctx.req
          ? args.ctx.req.headers['user-agent']
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
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

function MyApp({ Component, pageProps }: AppProps) {
  const connectors = getInstalledInjectedConnectors();
  return (
    <BreakpointProvider queries={queries}>
      <WalletProvider>
        <ApolloProvider client={apolloClient}>
          <StarknetProvider
            defaultProvider={
              new Provider({
                rpc: {
                  nodeUrl:
                    'https://starknet-goerli.infura.io/v3/badbe99a05ad427a9ddbbed9e002caf6',
                },
              })
            }
            autoConnect
            connectors={connectors}
          >
            <QueryClientProvider client={queryClient}>
              <TransactionQueueProvider>
                <Component {...pageProps} />
              </TransactionQueueProvider>

              {/* <PageTransition
                Component={Component}
                pageProps={pageProps}
              ></PageTransition> */}
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
              />
            </QueryClientProvider>
          </StarknetProvider>
        </ApolloProvider>
      </WalletProvider>
      <Toaster gutter={12} containerClassName="mt-16 right-0">
        {(t) => <ToastBar position="top-right" toast={t} />}
      </Toaster>
    </BreakpointProvider>
  );
}

export default PageWrapper(MyApp);
