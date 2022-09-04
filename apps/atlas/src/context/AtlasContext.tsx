import { createContext, useContext } from 'react';
import type { Travel } from '@/hooks/settling/useTravel';
import useTravel from '@/hooks/settling/useTravel';
import type { AtlasMap } from '@/hooks/useAtlasMap';
import { useAtlasMap } from '@/hooks/useAtlasMap';

interface AtlasContext {
  travelContext: Travel;
  mapContext: AtlasMap;
}

const AtlasContext = createContext<AtlasContext | undefined>(undefined);

export function useAtlasContext(): AtlasContext {
  return useContext(AtlasContext) as AtlasContext;
}

export const AtlasProvider = (props: { children: React.ReactNode }) => {
  const travelContext = useTravel();
  const mapContext = useAtlasMap();
  return (
    <AtlasContext.Provider value={{ travelContext, mapContext }}>
      {props.children}
    </AtlasContext.Provider>
  );
};
