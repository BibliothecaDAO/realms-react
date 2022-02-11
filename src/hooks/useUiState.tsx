import { createContext, useContext, useState, useMemo } from "react";

import { UiState } from "~/types";

const UIContext = createContext<UiState>({
  isMenuOpen: false,
  toggleMenu: () => {},
});

export const useUIContext = () => useContext(UIContext);

export const UIContextProvider = ({ children }: { children: any }) => {
  const [state, setState] = useState({
    isMenuOpen: false,
  });
  const value = useMemo(() => {
    const toggleMenu = () =>
      setState({
        ...state,
        isMenuOpen: !state.isMenuOpen,
      });
    return {
      ...state,
      toggleMenu,
    };
  }, [state]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
