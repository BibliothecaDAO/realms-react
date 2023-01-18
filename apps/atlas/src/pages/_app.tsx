import { ApolloProvider } from '@apollo/client';
import { Button } from '@bibliotheca-dao/ui-lib/base';
import CartridgeConnector from '@cartridge/connector';
import { UserAgentProvider } from '@quentin-sommer/react-useragent';
import { StarknetConfig, InjectedConnector } from '@starknet-react/core';
import { ConnectKitProvider } from 'connectkit';
import type { AppProps } from 'next/app';
import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster, ToastBar } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';
import { SplashScreen } from '@/components/navigation/SplashScreen';
import { Modals } from '@/components/ui/Modal';
import { AtlasProvider } from '@/context/AtlasContext';
import { BankProvider } from '@/context/BankContext';
import { CommandListProvider } from '@/context/CommandListContext';
import { ModalProvider } from '@/context/ModalContext';
import { SoundProvider } from '@/context/soundProvider';
import { UIProvider } from '@/context/UIContext';
import { UserBalancesProvider } from '@/context/UserBalancesContext';
import { BreakpointProvider } from '@/hooks/useBreakPoint';
import '../styles/global.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import apolloClient from '@/util/apolloClient';
import { wagmiClient } from '@/util/wagmi';

// Create a react-query client
// const queryClient = new QueryClient();

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
  const connectors = useMemo(
    () => [
      new InjectedConnector({ options: { id: 'argentX' } }),
      new InjectedConnector({ options: { id: 'braavos' } }),
      new InjectedConnector({ options: { id: 'guildly' } }),
      // new CartridgeConnector([
      //   {
      //     target: ModuleAddr.Labor,
      //     method: 'harvest',
      //   },
      // ]),
    ],
    []
  );
  return (
    <ApolloProvider client={apolloClient}>
      <BreakpointProvider queries={queries}>
        <ModalProvider>
          <WagmiConfig client={wagmiClient}>
            <ConnectKitProvider theme="midnight">
              <StarknetConfig connectors={connectors} autoConnect>
                {/* <QueryClientProvider client={queryClient}> */}
                <CommandListProvider>
                  <UserBalancesProvider>
                    <BankProvider>
                      <SoundProvider>
                        <SplashScreen>
                          <AtlasProvider>
                            <UIProvider>
                              <DndProvider backend={HTML5Backend}>
                                <Component {...pageProps} />
                                <Modals />
                              </DndProvider>
                            </UIProvider>
                          </AtlasProvider>
                        </SplashScreen>
                      </SoundProvider>
                    </BankProvider>
                  </UserBalancesProvider>
                </CommandListProvider>
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
              <Button className="text-center" variant="primary" size="md">
                {icon}
                {message}
              </Button>
            )}
          </ToastBar>
        )}
      </Toaster>
    </ApolloProvider>
  );
}

export default PageWrapper(MyApp);
