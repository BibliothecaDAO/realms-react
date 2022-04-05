import type { Dispatch } from 'react';
import { createContext, useContext, useReducer } from 'react';

type RatingFilter = { bagGreatness: number; bagRating: number };

interface GaState {
  ratingFilter: RatingFilter;
  favouriteGa: string[];
}

type GaAction =
  | { type: 'updateRatingFilter'; payload: RatingFilter }
  | { type: 'clearFilfters' }
  | { type: 'addFavouriteGa'; payload: string }
  | { type: 'removeFavouriteGa'; payload: string };

interface GaActions {
  updateRatingFilter(filter: RatingFilter): void;
  clearFilters(): void;
  addFavouriteGa(id: string): void;
  removeFavouriteGa(id: string): void;
}

const defaultFilters = {
  ratingFilter: {
    bagGreatness: 0,
    bagRating: 0,
  },
};
const defaultGaState = {
  ...defaultFilters,
  favouriteGa: [] as string[],
};

function gaReducer(state: GaState, action: GaAction): GaState {
  switch (action.type) {
    case 'updateRatingFilter':
      return { ...state, ratingFilter: action.payload };
    case 'clearFilfters':
      return { ...state, ...defaultFilters };
    case 'addFavouriteGa':
      return {
        ...state,
        favouriteGa: [...state.favouriteGa, action.payload],
      };
    case 'removeFavouriteGa':
      return {
        ...state,
        favouriteGa: state.favouriteGa.filter(
          (id: string) => id !== action.payload
        ),
      };
    default:
      return state;
  }
}

// Actions
const mapActions = (dispatch: Dispatch<GaAction>): GaActions => ({
  updateRatingFilter: (filter: RatingFilter) =>
    dispatch({
      type: 'updateRatingFilter',
      payload: filter,
    }),
  clearFilters: () => dispatch({ type: 'clearFilfters' }),
  addFavouriteGa: (id: string) =>
    dispatch({ type: 'addFavouriteGa', payload: id }),
  removeFavouriteGa: (id: string) =>
    dispatch({ type: 'removeFavouriteGa', payload: id }),
});

const GaContext = createContext<{
  state: GaState;
  dispatch: Dispatch<GaAction>;
  actions: GaActions;
}>(null!);

export function useGaContext() {
  return useContext(GaContext);
}

export function GaProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(gaReducer, defaultGaState);

  return (
    <GaContext.Provider
      value={{ state, dispatch, actions: mapActions(dispatch) }}
    >
      {children}
    </GaContext.Provider>
  );
}
