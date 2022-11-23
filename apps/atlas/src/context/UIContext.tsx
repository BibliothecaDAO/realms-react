import { createContext, useContext } from 'react';
import { CryptSideBar } from '@/components/sidebars/CryptsSideBar';
import type { Travel } from '@/hooks/settling/useTravel';
import useTravel from '@/hooks/settling/useTravel';
import type { AtlasMap } from '@/hooks/useAtlasMap';
import { useAtlasMap } from '@/hooks/useAtlasMap';
import { useUi, UIContext } from '@/hooks/useUi';

const UIContext = createContext<UIContext | undefined>(null!);

export function useUIContext(): UIContext {
  return useContext(UIContext) as UIContext;
}

export const UIProvider = (props: { children: React.ReactNode }) => {
  const travelContext = useTravel();
  const mapContext = useAtlasMap();
  return (
    <UIContext.Provider value={useUi()}>{props.children}</UIContext.Provider>
  );
};
