/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext, useState } from 'react';

const defaultUIContext = {
  powerBar: false,
  togglePowerBar: () => {},
  setup: false,
  toggleSetup: () => {},
  empireMenu: false,
  toggleEmpireMenu: () => {},
  resourceMenu: false,
  toggleResourceMenu: () => {},
  theOrdersMenu: false,
  toggleTheOrdersMenu: () => {},
  closeAll: (excludes: string[]) => {},
  mainMenu: false,
  toggleMainMenu: () => {},
  closeOrdersMenu: () => {},
  openSidebar: null,
  toggleOpenSidebar: (sidebar: SidebarName) => {},
  closeAllSidebars: () => {},
  toggleArtBackground: () => {},
  artBackground: true,
};

const UIContext = createContext<{
  powerBar: boolean;
  togglePowerBar: () => void;
  setup: boolean;
  toggleSetup: () => void;
  empireMenu: boolean;
  toggleEmpireMenu: () => void;
  resourceMenu: boolean;
  toggleResourceMenu: () => void;
  theOrdersMenu: boolean;
  toggleTheOrdersMenu: () => void;
  mainMenu: boolean;
  toggleMainMenu: () => void;
  closeOrdersMenu: () => void;
  openSidebar: SidebarName;
  toggleOpenSidebar: (sidebar: SidebarName) => void;
  closeAllSidebars: () => void;
  toggleArtBackground: () => void;
  artBackground: boolean;
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

type SidebarName = 'realms' | 'crypts' | 'loot' | 'GA' | null;

function useUI() {
  const [powerBar, setPowerBar] = useState(false);
  const [setup, setSetup] = useState(false);
  const [empireMenu, setEmpireMenu] = useState(false);
  const [resourceMenu, setResourceMenu] = useState(false);
  const [theOrdersMenu, setTheOrdersMenu] = useState(false);
  const [mainMenu, setMainMenu] = useState(true);
  const [artBackground, setArtBackground] = useState(true);

  const [openSidebar, setOpenSidebar] = useState<SidebarName>(null);

  const closeAllSidebars = () => {
    setOpenSidebar(null);
  };

  const toggleOpenSidebar = (sidebar: SidebarName) => {
    setOpenSidebar(sidebar);
  };
  const toggleArtBackground = () => {
    setArtBackground(!artBackground);
  };
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

  return {
    powerBar,
    togglePowerBar,
    setup,
    toggleSetup,
    empireMenu,
    toggleEmpireMenu,
    toggleResourceMenu,
    resourceMenu,
    toggleTheOrdersMenu,
    theOrdersMenu,
    toggleMainMenu,
    mainMenu,
    closeOrdersMenu,
    openSidebar,
    toggleOpenSidebar,
    closeAllSidebars,
    toggleArtBackground,
    artBackground,
  };
}

export function useUIContext() {
  return useContext(UIContext);
}
