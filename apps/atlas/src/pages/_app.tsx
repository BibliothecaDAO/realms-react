import { ApolloProvider } from '@apollo/client';
import { UserAgentProvider } from '@quentin-sommer/react-useragent';
import {
  StarknetProvider,
  getInstalledInjectedConnectors,
} from '@starknet-react/core';
import { connect } from 'get-starknet';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider, RpcProvider } from 'starknet';
import { TransactionQueueProvider } from '@/context/TransactionQueueContext';
import { BreakpointProvider } from '@/hooks/useBreakPoint';
import { WalletProvider } from '@/hooks/useWalletContext';
import '../styles/global.css';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  useEffect(() => {
    // match the dapp with a wallet instance
    connect({ showList: false }).then((wallet) => {
      // connect the dapp with the chosen wallet instance
      wallet?.enable({ showModal: false }).then(() => {
        const isConnected = !!wallet?.isConnected;
        // use `isConnected` :thumbsup:
      });
    });
  }, []);

  const customToast = () =>
    toast.custom((t) => (
      <div
        className={`bg-white px-6 py-4 shadow-md rounded-full ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}
      >
        Hello TailwindCSS! 👋
      </div>
    ));

  return (
    <BreakpointProvider queries={queries}>
      <WalletProvider>
        <ApolloProvider client={apolloClient}>
          <StarknetProvider
            defaultProvider={
              new RpcProvider({
                nodeUrl:
                  'https://starknet-goerli.infura.io/v3/badbe99a05ad427a9ddbbed9e002caf6',
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
      <Toaster
        gutter={12}
        toastOptions={{
          className: '',
          style: {
            padding: '0px',
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <div className="flex p-3 rounded shadow-lg stroke-current font-display bg-cta-100 shadow-purple-800/30 text-stone-200">
                {icon}
                {message}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
    </BreakpointProvider>
  );
}

export default PageWrapper(MyApp);
