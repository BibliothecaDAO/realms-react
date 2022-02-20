import { useUIContext } from "~/hooks/useUIContext";
import { MouseEventHandler, useCallback, useState } from "react";
import VolumeIcon from "../../../public/svg/volume-2.svg";
import VolumeMuteIcon from "../../../public/svg/volume-x.svg";
import Castle from "../../../public/svg/castle.svg";
import Danger from "../../../public/svg/danger.svg";
import Mountain from "../../../public/svg/mountain.svg";
import Library from "../../../public/svg/library.svg";
import Crown from "../../../public/svg/crown.svg";
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

  const buttonClasses =
    "p-2 sm:p-4 hover:bg-white/30 sm:py-8 sm:text-xl text-off-200";
  const iconClasses = "mx-auto w-4 sm:w-10 fill-current mb-1";
  return (
    <div
      className={`w-full sm:h-screen bottom-0 sm:w-32 sm:right-0 sm:top-0 sm:justify-center  bg-white/50  z-10 absolute backdrop-blur-md flex sm:flex-col justify-evenly transform duration-300 transition-all ${
        mainMenu ? "" : "translate-y-full hidden"
      }`}
    >
      {account && (
        <button className={buttonClasses} onClick={toggleEmpireMenu}>
          <Crown className="mx-auto w-8 sm:w-16 fill-current mb-1" />

          <span className="hidden sm:block">My Empire</span>
        </button>
      )}

      <button className={buttonClasses} onClick={toggleMapMenu}>
        <Castle className={iconClasses} />
        <span className="hidden sm:block">Realms</span>
      </button>
      <button className={buttonClasses} onClick={toggleCryptsMenu}>
        <Danger className={iconClasses} />

        <span className="hidden sm:block">Crypts</span>
      </button>
      <button className={buttonClasses} onClick={toggleResourceMenu}>
        <Mountain className={iconClasses} />

        <span className="hidden sm:block">Resources</span>
      </button>
      <button className={buttonClasses} onClick={toggleTheOrdersMenu}>
        <Library className={iconClasses} />

        <span className="hidden sm:block">Orders</span>
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
