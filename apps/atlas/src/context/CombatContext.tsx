'use client';

import type { Dispatch } from 'react';
import { createContext, useContext, useReducer } from 'react';
import { storage } from '@/util/localStorage';
export const CombatFavoriteLocalStorageKey = 'Combat.favourites';

interface CombatState {
  favouriteArmies: number[];
  isTravellingFilter: boolean;
  selectedArmies: number[];
}

type CombatAction =
  | { type: 'toggleIsTravellingFilter' }
  | { type: 'clearFilters' }
  | { type: 'addFavouriteArmy'; payload: number }
  | { type: 'removeFavouriteArmy'; payload: number }
  | { type: 'updateSearchIdFilter'; payload: string }
  | { type: 'toggleArmySelection'; payload: number }
  | { type: 'toggleSelectAllArmies'; payload: number[] };

interface CombatActions {
  toggleIsTravellingFilter(): void;
  clearFilters(): void;
  addFavouriteCombat(CombatId: number): void;
  removeFavouriteCombat(CombatId: number): void;
  updateSearchIdFilter(CombatId: string): void;
}

const defaultFilters = {
  isTravellingFilter: true,
};

const defaultCombatState = {
  ...defaultFilters,
  favouriteArmies: [] as number[],
  selectedArmies: [] as number[],
};

function combatReducer(state: CombatState, action: CombatAction): CombatState {
  switch (action.type) {
    case 'toggleIsTravellingFilter':
      return { ...state, isTravellingFilter: !state.isTravellingFilter };
    case 'clearFilters':
      return { ...state, ...defaultFilters };
    case 'addFavouriteArmy':
      storage<number[]>(CombatFavoriteLocalStorageKey, []).set([
        ...state.favouriteArmies,
        action.payload,
      ]);
      return {
        ...state,
        favouriteArmies: [...state.favouriteArmies, action.payload],
      };
    case 'removeFavouriteArmy':
      storage<number[]>(CombatFavoriteLocalStorageKey, []).set(
        state.favouriteArmies.filter(
          (combatId: number) => combatId !== action.payload
        )
      );
      return {
        ...state,
        favouriteArmies: state.favouriteArmies.filter(
          (combatId: number) => combatId !== action.payload
        ),
      };
    default:
      return state;
  }
}

// Actions
const mapActions = (dispatch: Dispatch<CombatAction>): CombatActions => ({
  updateSearchIdFilter: (combatId: string) =>
    dispatch({ type: 'updateSearchIdFilter', payload: combatId }),

  toggleIsTravellingFilter: () =>
    dispatch({ type: 'toggleIsTravellingFilter' }),
  clearFilters: () => dispatch({ type: 'clearFilters' }),
  addFavouriteCombat: (combatId: number) =>
    dispatch({ type: 'addFavouriteArmy', payload: combatId }),
  removeFavouriteCombat: (combatId: number) =>
    dispatch({ type: 'removeFavouriteArmy', payload: combatId }),
});

const CombatContext = createContext<{
  state: CombatState;
  dispatch: Dispatch<CombatAction>;
  actions: CombatActions;
}>(null!);

export function useCombatContext() {
  return useContext(CombatContext);
}

export function CombatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(combatReducer, {
    ...defaultCombatState,
    favouriteArmies: storage<number[]>(CombatFavoriteLocalStorageKey, []).get(),
  });

  return (
    <CombatContext.Provider
      value={{ state, dispatch, actions: mapActions(dispatch) }}
    >
      {children}
    </CombatContext.Provider>
  );
}
