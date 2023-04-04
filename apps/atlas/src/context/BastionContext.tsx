import { createContext, useContext } from 'react';
import type { Bastions } from '@/hooks/settling/useBastions';
import { useBastions } from '@/hooks/settling/useBastions';
import type { Travel } from '@/hooks/settling/useTravel';
import useTravel from '@/hooks/settling/useTravel';
import type { AtlasMap } from '@/hooks/useAtlasMap';
import { useAtlasMap } from '@/hooks/useAtlasMap';
import type { Bastion } from 'mockup/bastionsData';

interface BastionContext {
  bastionContext: Bastions;
}

const BastionContext = createContext<BastionContext | undefined>(undefined);

export function useBastionContext(): BastionContext {
  return useContext(BastionContext) as BastionContext;
}

export const BastionProvider = (props: { children: React.ReactNode }) => {
  const bastionContext = useBastions();
  return (
    <BastionContext.Provider value={{ bastionContext }}>
      {props.children}
    </BastionContext.Provider>
  );
};
