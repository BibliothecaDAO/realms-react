import type { Dispatch } from 'react';
import { createContext, useContext, useReducer } from 'react';
import { RealmsMax } from '@/constants/index';
import type { OrderType } from '@/generated/graphql';
import { RealmTraitType } from '@/generated/graphql';
import { storage } from '@/util/localStorage';
import type { MinMaxRange } from '../types';
export const RealmFavoriteLocalStorageKey = 'realm.favourites';

type RarityFilter = {
  score: MinMaxRange;
  rank: MinMaxRange;
};

type TraitsFilter = {
  [RealmTraitType.Region]: MinMaxRange;
  [RealmTraitType.City]: MinMaxRange;
  [RealmTraitType.Harbor]: MinMaxRange;
  [RealmTraitType.River]: MinMaxRange;
};

type RelicFilter = null | 'annexed' | 'self sovereign';

interface RealmState {
  rarityFilter: RarityFilter;
  relicFilter: RelicFilter;
  traitsFilter: TraitsFilter;
  selectedOrders: OrderType[];
  selectedResources: number[];
  favouriteRealms: number[];
  searchIdFilter: string;
  hasWonderFilter: boolean;
  isSettledFilter: boolean;
  isRaidableFilter: boolean;
  selectedRealms: number[];
}

type RealmAction =
  | { type: 'updateRarityFilter'; payload: RarityFilter }
  | { type: 'updateTraitsFilter'; payload: TraitsFilter }
  | { type: 'updateRelicFilter'; payload: RelicFilter }
  | { type: 'updateSelectedOrders'; payload: OrderType[] }
  | { type: 'updateSelectedResources'; payload: number[] }
  | { type: 'toggleHasWonderFilter' }
  | { type: 'toggleIsSettledFilter' }
  | { type: 'toggleIsRaidableFilter' }
  | { type: 'clearFilters' }
  | { type: 'addFavouriteRealm'; payload: number }
  | { type: 'removeFavouriteRealm'; payload: number }
  | { type: 'updateSearchIdFilter'; payload: string }
  | { type: 'toggleRealmSelection'; payload: number }
  | { type: 'toggleSelectAllRealms'; payload: number[] };

interface RealmActions {
  updateRarityFilter(filter: RarityFilter): void;
  updateTraitsFilter(filter: TraitsFilter): void;
  updateRelicFilter(filter: RelicFilter): void;
  updateSelectedOrders(orders: OrderType[]): void;
  updateSelectedResources(resources: number[]): void;
  toggleHasWonderFilter(): void;
  toggleIsSettledFilter(): void;
  toggleIsRaidableFilter(): void;
  clearFilters(): void;
  addFavouriteRealm(realmId: number): void;
  removeFavouriteRealm(realmId: number): void;
  updateSearchIdFilter(realmId: string): void;
}

const defaultFilters = {
  rarityFilter: {
    score: {
      min: 0,
      max: RealmsMax.Score,
    },
    rank: {
      min: 0,
      max: RealmsMax.Rank,
    },
  },
  traitsFilter: {
    [RealmTraitType.Region]: { min: 0, max: RealmsMax.Region },
    [RealmTraitType.City]: { min: 0, max: RealmsMax.City },
    [RealmTraitType.Harbor]: { min: 0, max: RealmsMax.Harbour },
    [RealmTraitType.River]: { min: 0, max: RealmsMax.River },
  },
  relicFilter: null,
  selectedOrders: [] as OrderType[],
  selectedResources: [] as number[],
  searchIdFilter: '',
  hasWonderFilter: false,
  isSettledFilter: true,
  isRaidableFilter: true,
};

const defaultRealmState = {
  ...defaultFilters,
  favouriteRealms: [] as number[],
  selectedRealms: [] as number[],
};

function realmReducer(state: RealmState, action: RealmAction): RealmState {
  switch (action.type) {
    case 'updateRarityFilter':
      return { ...state, rarityFilter: action.payload };
    case 'updateRelicFilter':
      return { ...state, relicFilter: action.payload };
    case 'updateSearchIdFilter':
      return { ...state, searchIdFilter: action.payload };
    case 'updateTraitsFilter':
      return { ...state, traitsFilter: action.payload };
    case 'toggleHasWonderFilter':
      return { ...state, hasWonderFilter: !state.hasWonderFilter };
    case 'toggleIsSettledFilter':
      return { ...state, isSettledFilter: !state.isSettledFilter };
    case 'toggleIsRaidableFilter':
      return { ...state, isRaidableFilter: !state.isRaidableFilter };
    case 'updateSelectedOrders':
      return { ...state, selectedOrders: [...action.payload] };
    case 'updateSelectedResources':
      return { ...state, selectedResources: [...action.payload] };
    case 'clearFilters':
      return { ...state, ...defaultFilters };
    case 'addFavouriteRealm':
      storage<number[]>(RealmFavoriteLocalStorageKey, []).set([
        ...state.favouriteRealms,
        action.payload,
      ]);
      return {
        ...state,
        favouriteRealms: [...state.favouriteRealms, action.payload],
      };
    case 'removeFavouriteRealm':
      storage<number[]>(RealmFavoriteLocalStorageKey, []).set(
        state.favouriteRealms.filter(
          (realmId: number) => realmId !== action.payload
        )
      );
      return {
        ...state,
        favouriteRealms: state.favouriteRealms.filter(
          (realmId: number) => realmId !== action.payload
        ),
      };
    default:
      return state;
  }
}

// Actions
const mapActions = (dispatch: Dispatch<RealmAction>): RealmActions => ({
  updateRarityFilter: (filter: RarityFilter) =>
    dispatch({
      type: 'updateRarityFilter',
      payload: filter,
    }),
  updateSearchIdFilter: (realmId: string) =>
    dispatch({ type: 'updateSearchIdFilter', payload: realmId }),
  updateRelicFilter: (filter: RelicFilter) =>
    dispatch({ type: 'updateRelicFilter', payload: filter }),
  toggleHasWonderFilter: () => dispatch({ type: 'toggleHasWonderFilter' }),
  toggleIsSettledFilter: () => dispatch({ type: 'toggleIsSettledFilter' }),
  toggleIsRaidableFilter: () => dispatch({ type: 'toggleIsRaidableFilter' }),
  updateTraitsFilter: (filter: TraitsFilter) =>
    dispatch({ type: 'updateTraitsFilter', payload: filter }),
  updateSelectedOrders: (orders: OrderType[]) =>
    dispatch({ type: 'updateSelectedOrders', payload: orders }),
  updateSelectedResources: (resources: number[]) => {
    dispatch({ type: 'clearFilters' });
    dispatch({ type: 'updateSelectedResources', payload: resources });
  },
  clearFilters: () => dispatch({ type: 'clearFilters' }),
  addFavouriteRealm: (realmId: number) =>
    dispatch({ type: 'addFavouriteRealm', payload: realmId }),
  removeFavouriteRealm: (realmId: number) =>
    dispatch({ type: 'removeFavouriteRealm', payload: realmId }),
});

const RealmContext = createContext<{
  state: RealmState;
  dispatch: Dispatch<RealmAction>;
  actions: RealmActions;
}>(null!);

export function useRealmContext() {
  return useContext(RealmContext);
}

export function RealmProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(realmReducer, {
    ...defaultRealmState,
    favouriteRealms: storage<number[]>(RealmFavoriteLocalStorageKey, []).get(),
  });

  return (
    <RealmContext.Provider
      value={{ state, dispatch, actions: mapActions(dispatch) }}
    >
      {children}
    </RealmContext.Provider>
  );
}
