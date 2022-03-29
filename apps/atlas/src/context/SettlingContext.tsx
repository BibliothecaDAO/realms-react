import type { Dispatch } from 'react';
import { createContext, useContext, useReducer } from 'react';
import type { ResourceType, OrderType } from '@/generated/graphql';

type RarityFilter = { rarityScore: number; rarityRank: number };

type TraitsFilter = {
  region: number;
  city: number;
  harbour: number;
  river: number;
};

interface SettlingState {
  rarityFilter: RarityFilter;
  traitsFilter: TraitsFilter;
  selectedOrders: OrderType[];
  selectedResources: ResourceType[];
}

type SettlingAction =
  | { type: 'updateRarityFilter'; payload: RarityFilter }
  | { type: 'updateTraitsFilter'; payload: TraitsFilter }
  | { type: 'updateSelectedOrders'; payload: OrderType[] }
  | { type: 'updateSelectedResources'; payload: ResourceType[] };

function settlingReducer(
  state: SettlingState,
  action: SettlingAction
): SettlingState {
  switch (action.type) {
    case 'updateRarityFilter':
      return { ...state, rarityFilter: action.payload };
    case 'updateTraitsFilter':
      return { ...state, traitsFilter: action.payload };
    case 'updateSelectedOrders':
      return { ...state, selectedOrders: [...action.payload] };
    case 'updateSelectedResources':
      return { ...state, selectedResources: [...action.payload] };
    default:
      return state;
  }
}

const defaultSettlingState = {
  rarityFilter: {
    rarityScore: 0,
    rarityRank: 0,
  },
  traitsFilter: {
    region: 0,
    city: 0,
    harbour: 0,
    river: 0,
  },
  selectedOrders: [] as OrderType[],
  selectedResources: [] as ResourceType[],
};

const SettlingContext = createContext<{
  state: SettlingState;
  dispatch: Dispatch<SettlingAction>;
}>({
  state: defaultSettlingState,
  dispatch: (_: SettlingAction) => {
    return;
  },
});

export function useSettlingContext() {
  return useContext(SettlingContext);
}

export function SettlingProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(settlingReducer, defaultSettlingState);

  return (
    <SettlingContext.Provider value={{ state, dispatch }}>
      {children}
    </SettlingContext.Provider>
  );
}
