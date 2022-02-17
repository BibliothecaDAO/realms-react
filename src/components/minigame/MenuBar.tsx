import React, { useCallback, useState } from "react";
import { useSound } from "~/context/soundProvider";
import VolumeIcon from "../../../public/svg/volume-2.svg";
import VolumeMuteIcon from "../../../public/svg/volume-x.svg";
import Zap from "../../../public/svg/zap.svg";
import Clock from "../../../public/svg/clock.svg";
import Settings from "../../../public/svg/settings.svg";
import { DesiegeTab } from "./ShieldGame";

type Prop = {
  toggleTab?: (tab: DesiegeTab) => void;
};

function MenuBar(props: Prop) {
  const { isSoundActive, toggleSound } = useSound();
  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  return (
    <div className="absolute w-full bottom-2 ">
      <div className="flex justify-around h-12 px-4 mx-auto align-middle w-96 rounded-2xl backdrop-blur-md bg-white/40">
        <button
          className="self-center mute-btn hover:text-blue-700"
          onClick={handleClick}
        >
          <Clock className="w-8 " />
        </button>
        <button
          className="self-center mute-btn hover:text-blue-700"
          onClick={() => props.toggleTab && props.toggleTab("game-controls")}
        >
          <Settings className="w-8" />
        </button>
        <button
          className="self-center mute-btn hover:text-blue-700"
          onClick={() => props.toggleTab && props.toggleTab("boost")}
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
