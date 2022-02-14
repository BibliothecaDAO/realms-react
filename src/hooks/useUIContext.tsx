import React, { createContext, useContext, useState } from "react";

const defaultUIContext = {
  powerBar: false,
  togglePowerBar: () => {},
  setup: false,
  toggleSetup: () => {},
  mapMenu: false,
  toggleMapMenu: () => {},
};

const UIContext = createContext<{
  powerBar: boolean;
  togglePowerBar: () => void;
  setup: boolean;
  toggleSetup: () => void;
  mapMenu: boolean;
  toggleMapMenu: () => void;
}>(defaultUIContext);

interface UIProviderProps {
  children: React.ReactNode;
}

export const UIProvider = (props: UIProviderProps) => {
  return (
    <UIContext.Provider value={useUI()}>{props.children}</UIContext.Provider>
  );
};

function useUI() {
  const [powerBar, setPowerBar] = useState(false);
  const [setup, setSetup] = useState(false);
  const [mapMenu, setMapMenu] = useState(true);

  const togglePowerBar = () => {
    return setPowerBar(!powerBar);
  };

  const toggleSetup = () => {
    return setSetup(!setup);
  };

  const toggleMapMenu = () => {
    return setMapMenu(!mapMenu);
  };

  return {
    powerBar,
    togglePowerBar,
    setup,
    toggleSetup,
    toggleMapMenu,
    mapMenu,
  };
}

export function useUIContext() {
  return useContext(UIContext);
}
