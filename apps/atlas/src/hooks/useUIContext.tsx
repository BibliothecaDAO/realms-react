/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext, useState } from 'react';

const defaultUIContext = {
  powerBar: false,
  togglePowerBar: () => {},
  setup: false,
  toggleSetup: () => {},
  mapMenu: false,
  empireMenu: false,
  toggleMapMenu: () => {},
  toggleEmpireMenu: () => {},
  resourceMenu: false,
  toggleResourceMenu: () => {},
  theOrdersMenu: false,
  toggleTheOrdersMenu: () => {},
  closeAll: (excludes: string[]) => {},
  mainMenu: false,
  toggleMainMenu: () => {},
  closeOrdersMenu: () => {},
  toggleCryptsMenu: () => {},
  cryptsMenu: false,
  toggleLootMenu: () => {},
  lootMenu: false,
  toggleGAMenu: () => {},
  GAMenu: false,
};

const UIContext = createContext<{
  powerBar: boolean;
  togglePowerBar: () => void;
  setup: boolean;
  toggleSetup: () => void;
  mapMenu: boolean;
  empireMenu: boolean;
  toggleMapMenu: () => void;
  toggleEmpireMenu: () => void;
  resourceMenu: boolean;
  toggleResourceMenu: () => void;
  theOrdersMenu: boolean;
  toggleTheOrdersMenu: () => void;
  closeAll: (excludes: string[]) => void;
  mainMenu: boolean;
  toggleMainMenu: () => void;
  closeOrdersMenu: () => void;
  toggleCryptsMenu: () => void;
  cryptsMenu: boolean;
  toggleLootMenu: () => void;
  lootMenu: boolean;
  toggleGAMenu: () => void;
  GAMenu: boolean;
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
  const [empireMenu, setEmpireMenu] = useState(false);
  const [resourceMenu, setResourceMenu] = useState(false);
  const [theOrdersMenu, setTheOrdersMenu] = useState(false);
  const [cryptsMenu, setCryptsMenu] = useState(false);
  const [lootMenu, setLootMenu] = useState(false);
  const [GAMenu, setGAMenu] = useState(false);
  const [mainMenu, setMainMenu] = useState(true);

  const hideOrOpenMainMenu = () => {
    if (mainMenu) {
      setMainMenu(() => false);
    } else {
      setMainMenu(() => true);
    }
  };

  const toggleCryptsMenu = () => {
    return setCryptsMenu(!cryptsMenu);
  };
  const toggleLootMenu = () => {
    return setLootMenu(!lootMenu);
  };
  const toggleGAMenu = () => {
    return setGAMenu(!GAMenu);
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
  const toggleEmpireMenu = () => {
    // hideOrOpenMainMenu();
    return setEmpireMenu(!empireMenu);
  };

  const toggleResourceMenu = () => {
    // hideOrOpenMainMenu();
    return setResourceMenu(!resourceMenu);
  };

  const toggleTheOrdersMenu = () => {
    // hideOrOpenMainMenu();
    return setTheOrdersMenu(!theOrdersMenu);
  };
  const closeOrdersMenu = () => {
    // hideOrOpenMainMenu();
    return setTheOrdersMenu(false);
  };
  const closeAll = (exclude: string[]) => {
    if (!exclude.includes('orders')) {
      setTheOrdersMenu(false);
    }
    setEmpireMenu(false);
    setResourceMenu(false);
    if (!exclude.includes('crypts')) {
      setCryptsMenu(false);
    }
    if (!exclude.includes('GA')) {
      setGAMenu(false);
    }
    if (!exclude.includes('loot')) {
      setLootMenu(false);
    }
    if (!exclude.includes('realms')) {
      return setMapMenu(false);
    }
  };

  return {
    powerBar,
    togglePowerBar,
    setup,
    toggleSetup,
    toggleMapMenu,
    empireMenu,
    toggleEmpireMenu,
    mapMenu,
    toggleResourceMenu,
    resourceMenu,
    toggleTheOrdersMenu,
    theOrdersMenu,
    closeAll,
    toggleMainMenu,
    mainMenu,
    closeOrdersMenu,
    toggleCryptsMenu,
    cryptsMenu,
    toggleLootMenu,
    lootMenu,
    toggleGAMenu,
    GAMenu,
  };
}

export function useUIContext() {
  return useContext(UIContext);
}