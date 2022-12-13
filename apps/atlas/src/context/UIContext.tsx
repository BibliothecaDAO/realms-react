import { createContext, useContext } from 'react';
import type { UIContextType } from '@/hooks/useUi';
import { useUi } from '@/hooks/useUi';

const UIContext = createContext<UIContextType | undefined>(null!);

export function useUIContext(): UIContextType {
  return useContext(UIContext) as UIContextType;
}

export const UIProvider = (props: { children: React.ReactNode }) => {
  return (
    <UIContext.Provider value={useUi()}>{props.children}</UIContext.Provider>
  );
};
