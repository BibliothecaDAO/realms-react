import type { Dispatch, SetStateAction } from 'react';
import {
  useCallback,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react';
import type { Bastion } from '@/generated/graphql';
import type { Bastions, Location } from '@/hooks/settling/useBastions';
import { useBastions } from '@/hooks/settling/useBastions';

// @dev Am using 3 different context in order to avoid rerenders
// 1 context for all setters (setBastion, setSelectedLocation)
// 1 context for the bastion state
// 1 context for the rest

interface BastionContext {
  bastionContext: Bastions;
}
interface BastionSettersContext {
  setSelectedLocation: Dispatch<SetStateAction<Location>>;
  setBastion: Dispatch<SetStateAction<Bastion | undefined>>;
}

interface BastionStateContext {
  bastion: Bastion | undefined;
}

const BastionContext = createContext<BastionContext | undefined>(undefined);

const BastionSettersContext = createContext<BastionSettersContext | undefined>(
  undefined
);

const BastionStateContext = createContext<BastionStateContext | undefined>(
  undefined
);

export function useBastionContext(): BastionContext {
  return useContext(BastionContext) as BastionContext;
}

export function useBastionSettersContext(): BastionSettersContext {
  return useContext(BastionSettersContext) as BastionSettersContext;
}

export function useBastionStateContext(): BastionStateContext {
  return useContext(BastionStateContext) as BastionStateContext;
}

export const BastionProvider = (props: { children: React.ReactNode }) => {
  const { setSelectedLocation, setBastion, bastion, ...bastionContext } =
    useBastions();

  const memoizedSettersContext = useMemo(
    () => ({
      setSelectedLocation,
      setBastion,
      bastion,
    }),
    [setSelectedLocation, setBastion, bastion]
  );

  const memoizedBastion = useMemo(
    () => ({
      bastion,
    }),
    [bastion]
  );

  return (
    <BastionContext.Provider
      value={{
        bastionContext: {
          setSelectedLocation,
          setBastion,
          bastion,
          ...bastionContext,
        },
      }}
    >
      <BastionSettersContext.Provider value={memoizedSettersContext}>
        <BastionStateContext.Provider value={memoizedBastion}>
          {props.children}
        </BastionStateContext.Provider>
      </BastionSettersContext.Provider>
    </BastionContext.Provider>
  );
};
