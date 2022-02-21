import React, { useCallback, useState } from "react";

import { useRouter } from "next/router";

import { useSound } from "~/context/soundProvider";
import VolumeIcon from "../../../public/svg/volume-2.svg";
import VolumeMuteIcon from "../../../public/svg/volume-x.svg";
import Zap from "../../../public/svg/zap.svg";
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

  const router = useRouter();

  return (
    <div className="absolute w-full text-black transition-all bottom-2 ">
      <div className="flex justify-around h-12 px-4 mx-auto align-middle w-96 rounded-2xl bg-white/40">
        <button
          className="self-center mute-btn hover:scale-105 hover:text-blue-700"
          onClick={() => {
            props.toggleTab && props.toggleTab("game-controls");
            router.replace("/desiege?tab=game-controls", undefined, {
              shallow: true,
            });
          }}
        >
          <Settings className="w-8" />
        </button>
        <button
          className="self-center mute-btn hover:text-blue-700"
          onClick={() => {
            props.toggleTab && props.toggleTab("lore");
            router.replace("/desiege?tab=lore", undefined, {
              shallow: true,
            });
          }}
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
