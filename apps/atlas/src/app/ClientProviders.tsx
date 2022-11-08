'use client';

import { ApolloProvider } from '@apollo/client';
// import { UserAgentProvider } from '@quentin-sommer/react-useragent';
import { StarknetConfig, InjectedConnector } from '@starknet-react/core';
import { ConnectKitProvider } from 'connectkit';
import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster, ToastBar } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';
import { Modals } from '@/components/modals';
import { AtlasProvider } from '@/context/AtlasContext';
import { CommandListProvider } from '@/context/CommandListContext';
import { ModalProvider } from '@/context/ModalContext';
import { ResourceProvider } from '@/context/ResourcesContext';
import { BreakpointProvider } from '@/hooks/useBreakPoint';
import apolloClient from '@/util/apolloClient';
import { wagmiClient } from '@/util/wagmi';
// Create a react-query client
// const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/* const PageWrapper = (Comp: any) =>
  class InnerPageWrapper extends React.Component<{ ua: string }> {
    /*
     * Need to use args.ctx
     * See https://nextjs.org/docs/advanced-features/custom-document
     */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/* static async getInitialProps(args: any) {
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
  }; */
const queries = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const connectors = useMemo(
    () => [
      new InjectedConnector({ options: { id: 'argentX' } }),
      new InjectedConnector({ options: { id: 'braavos' } }),
      new InjectedConnector({ options: { id: 'guildly' } }),
    ],
    []
  );
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <BreakpointProvider queries={queries}>
          <ModalProvider>
            <WagmiConfig client={wagmiClient}>
              <ConnectKitProvider theme="midnight">
                <StarknetConfig connectors={connectors} autoConnect>
                  {/* <QueryClientProvider client={queryClient}> */}
                  {/* TODO refactor resoource provider */}
                  <ResourceProvider>
                    <CommandListProvider>
                      <AtlasProvider>
                        <DndProvider backend={HTML5Backend}>
                          {children}
                          <Modals />
                        </DndProvider>
                      </AtlasProvider>
                    </CommandListProvider>
                  </ResourceProvider>
                  {/* <PageTransition
                Component={Component}
                pageProps={pageProps}
              ></PageTransition> */}
                  {/* <ReactQueryDevtools
                  initialIsOpen={false}
                  position="bottom-right"
                />
                </QueryClientProvider> */}
                </StarknetConfig>
              </ConnectKitProvider>
            </WagmiConfig>{' '}
          </ModalProvider>
        </BreakpointProvider>
      </ApolloProvider>
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
    </>
  );
}
