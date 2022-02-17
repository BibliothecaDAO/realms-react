import React, { createContext, useContext, useState } from "react";

const defaultUIContext = {
  powerBar: false,
  togglePowerBar: () => {},
  setup: false,
  toggleSetup: () => {},
  mapMenu: false,
  toggleMapMenu: () => {},
  resourceMenu: false,
  toggleResourceMenu: () => {},
  theOrdersMenu: false,
  toggleTheOrdersMenu: () => {},
  closeAll: () => {},
  mainMenu: false,
  toggleMainMenu: () => {},
};

const UIContext = createContext<{
  powerBar: boolean;
  togglePowerBar: () => void;
  setup: boolean;
  toggleSetup: () => void;
  mapMenu: boolean;
  toggleMapMenu: () => void;
  resourceMenu: boolean;
  toggleResourceMenu: () => void;
  theOrdersMenu: boolean;
  toggleTheOrdersMenu: () => void;
  closeAll: () => void;
  mainMenu: boolean;
  toggleMainMenu: () => void;
}>(defaultUIContext);

interface UIProviderProps {
  children: React.ReactNode;
}

export const UIProvider = (props: UIProviderProps) => {
  return (
    <UIContext.Provider value={useUI()}>{props.children}</UIContext.Provider>
  );
};

interface UI {
  main: false;
}

function useUI() {
  const [powerBar, setPowerBar] = useState(false);
  const [setup, setSetup] = useState(false);
  const [mapMenu, setMapMenu] = useState(false);
  const [resourceMenu, setResourceMenu] = useState(false);
  const [theOrdersMenu, setTheOrdersMenu] = useState(false);
  const [mainMenu, setMainMenu] = useState(true);

  const hideOrOpenMainMenu = () => {
    if (mainMenu) {
      setMainMenu(() => false);
    } else {
      setMainMenu(() => true);
    }
  };

  const toggleMainMenu = () => {
    return setMainMenu(!mainMenu);
  };

  const togglePowerBar = () => {
    return setPowerBar(!powerBar);
  };

  const toggleSetup = () => {
    return setSetup(!setup);
  };

  const toggleMapMenu = () => {
    // hideOrOpenMainMenu();
    return setMapMenu(!mapMenu);
  };

  const toggleResourceMenu = () => {
    // hideOrOpenMainMenu();
    return setResourceMenu(!resourceMenu);
  };

  const toggleTheOrdersMenu = () => {
    // hideOrOpenMainMenu();
    return setTheOrdersMenu(!theOrdersMenu);
  };
  const closeAll = () => {
    return setTheOrdersMenu(false);
  };

  return {
    powerBar,
    togglePowerBar,
    setup,
    toggleSetup,
    toggleMapMenu,
    mapMenu,
    toggleResourceMenu,
    resourceMenu,
    toggleTheOrdersMenu,
    theOrdersMenu,
    closeAll,
    toggleMainMenu,
    mainMenu,
  };
}

export function useUIContext() {
  return useContext(UIContext);
}
