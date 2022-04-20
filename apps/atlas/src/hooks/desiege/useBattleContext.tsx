import React, { useContext, useState, createContext } from 'react';

type BattleContextProps = {
  isDarkAttacking: boolean;
  isLightShielding: boolean;
  setDarkAttacking: (is: boolean) => void;
  setLightShielding: (is: boolean) => void;
};

const defaultValue = {
  isDarkAttacking: false,
  isLightShielding: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDarkAttacking: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLightShielding: () => {},
};

export const BattleContext = createContext<BattleContextProps>(defaultValue);

const BattleContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkAttacking, setDarkAttacking] = useState(false);
  const [isLightShielding, setLightShielding] = useState(false);

  const val = {
    isDarkAttacking,
    isLightShielding,
    setDarkAttacking,
    setLightShielding,
  };

  return (
    <BattleContext.Provider value={val}>{children}</BattleContext.Provider>
  );
};

function useBattleContext() {
  const ctx = useContext(BattleContext);
  if (ctx == undefined) {
    throw new Error(
      'useBattleContext must be used within a BattleContextProvider'
    );
  }
  return ctx;
}

export { BattleContextProvider, useBattleContext };
