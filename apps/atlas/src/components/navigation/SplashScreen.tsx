import { useEffect } from 'react';

import { AccountSettingsModal } from '@/components/navigation/AccountSettingModal';
import { useUIContext } from '@/context/UIContext';

export const SplashScreen = ({ children }) => {
  const { showSplash, accountSettingsModal, toggleAccountSettings } =
    useUIContext();

  return (
    <>
      {showSplash && (
        <div className="absolute left-0 z-20 flex items-center justify-center flex-1 w-full h-screen bg-cover bg-gray-1000 bg-realmBackground vignette-inset">
          {/* <div
            className="absolute top-0 bottom-0 left-0 right-0 flex flex-1 w-full mx-auto my-20 overflow-hidden transition duration-500 ease-in-out translate-x-0 rounded shadow-md opacity-100 bg-yellow-scroll shadow-black md:w-1/2 lg:w-1/3"
          >
            <div
              className="fixed flex flex-col flex-1 p-10 overflow-hidden text-center rounded-xl bg-gradient-to-r from-gray-900 to-gray-1000 top-2 left-2 bottom-2 right-2"
            >
              (her)
            </div>
          </div> */}
        </div>
      )}
      <AccountSettingsModal
        isOpen={accountSettingsModal}
        onClose={toggleAccountSettings}
      />
      {children}
    </>
  );
};
