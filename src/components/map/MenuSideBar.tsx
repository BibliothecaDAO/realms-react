import { useUIContext } from "~/hooks/useUIContext";
import { MouseEventHandler, useState } from "react";
import Box from "../../../public/svg/box.svg";
type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  resource: Array<String>;
};

export const MenuSideBar = () => {
  const { toggleResourceMenu, resourceMenu } = useUIContext();
  return (
    <div className="h-screen w-32 bg-white/50 right-0 top-0 z-30 absolute backdrop-blur-md flex flex-col justify-center">
      <button
        className="p-4 z-10 rounded hover:bg-white/30 py-8 text-xl text-off-200"
        onClick={toggleResourceMenu}
      >
        <Box className="mx-auto" />
        Resources
      </button>
      <button
        className="p-4 z-10 rounded hover:bg-white/30 py-8 text-xl text-off-200"
        onClick={toggleResourceMenu}
      >
        <Box className="mx-auto" />
        Orders
      </button>
    </div>
  );
};
