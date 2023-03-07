import { useEffect } from 'react';

import { AccountSettingsModal } from '@/components/navigation/AccountSettingModal';
import { useUIContext } from '@/context/UIContext';

export const SplashScreen = ({ children }) => {
  const { showSplash, accountSettingsModal, toggleAccountSettings } =
    useUIContext();

  return (
    <>
      {showSplash && (
        <div className="absolute left-0 flex flex-1 items-center justify-center w-full h-screen bg-cover z-100 bg-gray-1000 bg-realmBackground vignette-inset">
          {/* <div
            className="absolute top-0 flex flex-1 bottom-0 rounded transition duration-500 ease-in-out bg-yellow-scroll 
          shadow-md shadow-black right-0 top-0 left-0 bottom-0 my-20 md:w-1/2 lg:w-1/3 mx-auto left-0 overflow-hidden opacity-100 translate-x-0 w-full"
          >
            <div
              className="fixed flex flex-1 rounded-xl flex bg-gradient-to-r from-gray-900 to-gray-1000 
            overflow-hidden flex-col p-10 text-center top-2 left-2 bottom-2 right-2"
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
