import { useUIContext } from "~/hooks/useUIContext";
import { MouseEventHandler, useCallback, useState } from "react";
import Box from "../../../public/svg/box.svg";
import Map from "../../../public/svg/map.svg";
import Shield from "../../../public/svg/shieldSmall.svg";
import VolumeIcon from "../../../public/svg/volume-2.svg";
import VolumeMuteIcon from "../../../public/svg/volume-x.svg";
import { useSound } from "~/context/soundProvider";
import { useWalletContext } from "~/hooks/useWalletContext";
type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  resource: Array<String>;
};

export const MenuSideBar = () => {
  const { account } = useWalletContext();
  const {
    toggleResourceMenu,
    toggleTheOrdersMenu,
    toggleMapMenu,
    toggleEmpireMenu,
    mainMenu,
    toggleCryptsMenu,
  } = useUIContext();
  const { isSoundActive, toggleSound } = useSound();

  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  const iconClasses = "p-4 hover:bg-white/30 sm:py-8 text-xl text-off-200";
  return (
    <div
      className={`w-full sm:h-screen bottom-0 sm:w-32 sm:right-0 sm:top-0 sm:justify-center  bg-white/50  z-10 absolute backdrop-blur-md flex sm:flex-col justify-evenly transform duration-300 transition-all ${
        mainMenu ? "" : "translate-y-full hidden"
      }`}
    >
      {account && (
        <button className={iconClasses} onClick={toggleEmpireMenu}>
          👑 <br /> My Empire
        </button>
      )}

      <button className={iconClasses} onClick={toggleMapMenu}>
        <Map className="mx-auto" />
        Realms
      </button>
      <button className={iconClasses} onClick={toggleCryptsMenu}>
        <Map className="mx-auto" />
        Crypts
      </button>
      <button className={iconClasses} onClick={toggleResourceMenu}>
        <Box className="mx-auto" />
        Resources
      </button>
      <button className={iconClasses} onClick={toggleTheOrdersMenu}>
        <Shield className="mx-auto" />
        Orders
      </button>
      {/* <button
        className="p-4 py-8 text-xl hover:bg-white/30 text-off-200"
        onClick={handleClick}
      >
        {!isSoundActive ? (
          <VolumeMuteIcon className="w-8 mx-auto" />
        ) : (
          <VolumeIcon className="w-8 mx-auto" />
        )}
      </button> */}
    </div>
  );
};
