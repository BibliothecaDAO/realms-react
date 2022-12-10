import { createContext, useContext } from 'react';
import { useUi, UIContext } from '@/hooks/useUi';

const UIContext = createContext<UIContext | undefined>(null!);

export function useUIContext(): UIContext {
  return useContext(UIContext) as UIContext;
}

export const UIProvider = (props: { children: React.ReactNode }) => {
  return (
    <UIContext.Provider value={useUi()}>{props.children}</UIContext.Provider>
  );
};
