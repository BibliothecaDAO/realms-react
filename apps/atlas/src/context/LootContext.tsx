import type { Dispatch } from 'react';
import { createContext, useContext, useReducer } from 'react';

type RatingFilter = { bagGreatness: number; bagRating: number };

interface LootState {
  ratingFilter: RatingFilter;
  favouriteLoot: string[];
  searchIdFilter: string;
  selectedTab: number;
}

type LootAction =
  | { type: 'updateRatingFilter'; payload: RatingFilter }
  | { type: 'clearFilfters' }
  | { type: 'addFavouriteLoot'; payload: string }
  | { type: 'removeFavouriteLoot'; payload: string }
  | { type: 'updateSearchIdFilter'; payload: string }
  | { type: 'updateSelectedTab'; payload: number };

interface LootActions {
  updateRatingFilter(filter: RatingFilter): void;
  clearFilters(): void;
  addFavouriteLoot(id: string): void;
  removeFavouriteLoot(id: string): void;
  updateSearchIdFilter(id: string): void;
  updateSelectedTab(tab: number): void;
}

const defaultFilters = {
  ratingFilter: {
    bagGreatness: 0,
    bagRating: 0,
  },
  searchIdFilter: '',
};
const defaultLootState = {
  ...defaultFilters,
  favouriteLoot: [] as string[],
  selectedTab: 0,
};

function lootReducer(state: LootState, action: LootAction): LootState {
  switch (action.type) {
    case 'updateRatingFilter':
      return { ...state, ratingFilter: action.payload };
    case 'updateSearchIdFilter':
      return { ...state, searchIdFilter: action.payload };
    case 'updateSelectedTab':
      return { ...state, selectedTab: action.payload };
    case 'clearFilfters':
      return { ...state, ...defaultFilters };
    case 'addFavouriteLoot':
      return {
        ...state,
        favouriteLoot: [...state.favouriteLoot, action.payload],
      };
    case 'removeFavouriteLoot':
      return {
        ...state,
        favouriteLoot: state.favouriteLoot.filter(
          (id: string) => id !== action.payload
        ),
      };
    default:
      return state;
  }
}

// Actions
const mapActions = (dispatch: Dispatch<LootAction>): LootActions => ({
  updateRatingFilter: (filter: RatingFilter) =>
    dispatch({
      type: 'updateRatingFilter',
      payload: filter,
    }),
  updateSearchIdFilter: (id: string) =>
    dispatch({ type: 'updateSearchIdFilter', payload: id }),
  updateSelectedTab: (tab: number) =>
    dispatch({ type: 'updateSelectedTab', payload: tab }),
  clearFilters: () => dispatch({ type: 'clearFilfters' }),
  addFavouriteLoot: (id: string) =>
    dispatch({ type: 'addFavouriteLoot', payload: id }),
  removeFavouriteLoot: (id: string) =>
    dispatch({ type: 'removeFavouriteLoot', payload: id }),
});

const LootContext = createContext<{
  state: LootState;
  dispatch: Dispatch<LootAction>;
  actions: LootActions;
}>(null!);

export function useLootContext() {
  return useContext(LootContext);
}

export function LootProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(lootReducer, defaultLootState);

  return (
    <LootContext.Provider
      value={{ state, dispatch, actions: mapActions(dispatch) }}
    >
      {children}
    </LootContext.Provider>
  );
}
