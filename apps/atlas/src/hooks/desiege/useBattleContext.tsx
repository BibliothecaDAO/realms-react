import { useContext, createContext, useState } from 'react';

type BattleContextProps = {
  isDarkAttacking: boolean;
  isLightShielding: boolean;
  setDarkAttacking: (boolean) => void;
  setLightShielding: (boolean) => void;
};

const BattleContext = createContext<BattleContextProps | undefined>({
  isDarkAttacking: false,
  isLightShielding: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDarkAttacking: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLightShielding: () => {},
});

const useBattleContext = () => {
  const context = useContext(BattleContext);

  if (context === undefined) {
    throw new Error(
      'useBattleContext must be used within a BattleContextProvider'
    );
  }
  return context;
};

function BattleContextProvider({ children }) {
  const [isDarkAttacking, setDarkAttacking] = useState(false);
  const [isLightShielding, setLightShielding] = useState(false);

  return (
    <BattleContext.Provider
      value={{
        isDarkAttacking,
        isLightShielding,
        setDarkAttacking,
        setLightShielding,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
}

export { BattleContextProvider, useBattleContext };
