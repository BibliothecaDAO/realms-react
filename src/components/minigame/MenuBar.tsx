import React, { useCallback } from "react";
import { useSound } from "~/context/soundProvider";
import VolumeIcon from "../../../public/svg/volume-2.svg";
import VolumeMuteIcon from "../../../public/svg/volume-x.svg";
import Zap from "../../../public/svg/zap.svg";
import Clock from "../../../public/svg/clock.svg";
import Settings from "../../../public/svg/settings.svg";
import { useUIContext } from "~/hooks/useUIContext";

function MenuBar() {
  const { togglePowerBar, toggleSetup } = useUIContext();

  const { isSoundActive, toggleSound } = useSound();
  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  return (
    <div className="w-full  absolute bottom-2 ">
      <div className="w-96 h-12 rounded-2xl backdrop-blur-md bg-white/40 mx-auto flex justify-around px-4 align-middle">
        <button
          className="mute-btn  self-center hover:text-blue-700"
          onClick={handleClick}
        >
          <Clock className="w-8 " />
        </button>
        <button
          className="mute-btn  self-center hover:text-blue-700"
          onClick={toggleSetup}
        >
          <Settings className="w-8" />
        </button>
        <button
          className="mute-btn  self-center hover:text-blue-700"
          onClick={togglePowerBar}
        >
          <Zap className="w-8" />
        </button>
        <button className="mute-btn " onClick={handleClick}>
          {!isSoundActive ? (
            <VolumeMuteIcon className="w-8 hover:text-blue-700" />
          ) : (
            <VolumeIcon className="w-8 hover:text-blue-700" />
          )}
        </button>
      </div>
    </div>
  );
}

export default MenuBar;
