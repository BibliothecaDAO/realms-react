import { useUIContext } from "~/hooks/useUIContext";
import { MouseEventHandler, useCallback, useState } from "react";
import Box from "../../../public/svg/box.svg";
import VolumeIcon from "../../../public/svg/volume-2.svg";
import VolumeMuteIcon from "../../../public/svg/volume-x.svg";
import { useSound } from "~/context/soundProvider";
type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  resource: Array<String>;
};

export const MenuSideBar = () => {
  const { toggleResourceMenu, toggleTheOrdersMenu, toggleMapMenu } =
    useUIContext();
  const { isSoundActive, toggleSound } = useSound();

  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  return (
    <div className="h-screen w-32 bg-white/50 right-0 top-0 z-10 absolute backdrop-blur-md flex flex-col justify-center">
      <button
        className="p-4  hover:bg-white/30 py-8 text-xl text-off-200"
        onClick={toggleMapMenu}
      >
        <Box className="mx-auto" />
        Realm
      </button>
      <button
        className="p-4  hover:bg-white/30 py-8 text-xl text-off-200"
        onClick={toggleResourceMenu}
      >
        <Box className="mx-auto" />
        Resources
      </button>
      <button
        className="p-4  hover:bg-white/30 py-8 text-xl text-off-200"
        onClick={toggleTheOrdersMenu}
      >
        <Box className="mx-auto" />
        Orders
      </button>
      <button
        className="p-4  hover:bg-white/30 py-8 text-xl text-off-200"
        onClick={handleClick}
      >
        {!isSoundActive ? (
          <VolumeMuteIcon className="w-8 mx-auto" />
        ) : (
          <VolumeIcon className="w-8 mx-auto" />
        )}
      </button>
    </div>
  );
};
