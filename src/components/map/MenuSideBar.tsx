import { useUIContext } from "~/hooks/useUIContext";
import { MouseEventHandler, useCallback, useState } from "react";
import Castle from "../../../public/svg/castle.svg";
import Danger from "../../../public/svg/danger.svg";
import Mountain from "../../../public/svg/mountain.svg";
import Library from "../../../public/svg/library.svg";
import Crown from "../../../public/svg/crown.svg";
import Bag from "../../../public/svg/bag.svg";
import Helm from "../../../public/svg/helm.svg";
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
    toggleLootMenu,
    toggleGAMenu,
  } = useUIContext();
  const { isSoundActive, toggleSound } = useSound();

  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  const buttonClasses =
    "p-3 sm:p-4 hover:bg-white/30 sm:py-8 sm:text-xl text-off-200";
  const iconClasses = "mx-auto w-6 sm:w-10 fill-current mb-1";
  return (
    <div
      className={`w-full sm:h-screen bottom-0 sm:w-32 sm:right-0 sm:top-0 sm:justify-center  bg-white/50  z-10 absolute backdrop-blur-md flex sm:flex-col justify-evenly transform duration-300 transition-all ${
        mainMenu ? "" : "translate-y-full hidden"
      }`}
    >
      {account && (
        <button className={buttonClasses} onClick={toggleEmpireMenu}>
          <Crown className="w-8 mx-auto mb-1 fill-current sm:w-16" />
          <span className="hidden sm:block">My Empire</span>
        </button>
      )}
      <button className={buttonClasses} onClick={toggleMapMenu}>
        <Castle className={iconClasses} />
        <span className="hidden sm:block">Realms</span>
      </button>
      <button className={buttonClasses} onClick={toggleLootMenu}>
        <Bag className={"mx-auto w-8 sm:w-14 fill-current"} />
        <span className="hidden sm:block">Loot</span>
      </button>

      <button className={buttonClasses} onClick={toggleGAMenu}>
        <Helm className={"mx-auto w-8 sm:w-6 fill-current mb-4"} />
        <span className="hidden sm:block ">GA</span>
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
