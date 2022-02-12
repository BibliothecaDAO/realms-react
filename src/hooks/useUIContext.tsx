import React, { createContext, useContext, useState } from "react";

const defaultUIContext = {
  volume: false,
  toggleVolume: () => {},
};

const UIContext = createContext<{
  volume: boolean;
  toggleVolume: () => void;
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
  const [volume, setVolume] = useState(false);

  const toggleVolume = () => {
    return setVolume(!volume);
  };

  return {
    volume,
    toggleVolume,
  };
}

export function useUIContext() {
  return useContext(UIContext);
}
