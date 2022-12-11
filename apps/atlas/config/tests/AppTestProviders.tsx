import { ApolloProvider } from '@apollo/client';
import { StarknetConfig } from '@starknet-react/core';
import { queries } from '@testing-library/react';
import { ConnectKitProvider } from 'connectkit';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import type { FC, PropsWithChildren } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { vi } from 'vitest';
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
import apolloClient from '@/util/apolloClient';
import { wagmiClient } from '@/util/wagmi';
// import { AppProviders } from '../../src/app-providers';
/*
export const AppTestProviders: React.FC = ({ children }) => {
  return <AppProviders>{children}</AppProviders>;
};
*/ const querieSize = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};
export function createMockRouter(router?: Partial<NextRouter>): NextRouter {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    back: vi.fn(),
    beforePopState: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    reload: vi.fn(),
    replace: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
    forward: vi.fn(),
    ...router,
  };
}

export const AppTestProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <RouterContext.Provider value={createMockRouter()}>
      <ApolloProvider client={apolloClient}>
        <BreakpointProvider queries={querieSize}>
          <ModalProvider>
            <WagmiConfig client={wagmiClient}>
              <ConnectKitProvider theme="midnight">
                <StarknetConfig>
                  <CommandListProvider>
                    <UserBalancesProvider>
                      <BankProvider>
                        <SoundProvider>
                          <SplashScreen>
                            <AtlasProvider>
                              <UIProvider>
                                <DndProvider backend={HTML5Backend}>
                                  {children}
                                  <Modals />
                                </DndProvider>
                              </UIProvider>
                            </AtlasProvider>
                          </SplashScreen>
                        </SoundProvider>
                      </BankProvider>
                    </UserBalancesProvider>
                  </CommandListProvider>
                </StarknetConfig>
              </ConnectKitProvider>
            </WagmiConfig>
          </ModalProvider>
        </BreakpointProvider>
      </ApolloProvider>
    </RouterContext.Provider>
  );
};
