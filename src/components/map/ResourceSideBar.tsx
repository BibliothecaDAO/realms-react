import { useUIContext } from "~/hooks/useUIContext";
export const ResourceSideBar = () => {
  const { toggleResourceMenu, resourceMenu } = useUIContext();
  return (
    <div className="">
      <button
        className="absolute top-10 right-10 bg-white/20 transition-all p-4 z-10 rounded hover:bg-white/70"
        onClick={toggleResourceMenu}
      >
        Resources
      </button>
      <div
        className={`h-screen w-1/3 z-20 absolute p-6 bottom-0 backdrop-blur-md bg-off-200/30 rounded-r-2xl transform duration-300 transition-all  overflow-x-hidden right-0    ${
          resourceMenu ? "" : "translate-y-full hidden"
        }`}
      >
        <button
          className="bg-white/20 transition-all p-4 z-10 rounded hover:bg-white/70 mb-8"
          onClick={toggleResourceMenu}
        >
          Close
        </button>
        <h1 className="mb-4">Resource Diary</h1>
        <img
          src="https://github.com/BibliothecaForAdventurers/voxel-resources/blob/main/adamantine.gif?raw=true"
          alt=""
          className="w-full rounded-xl"
        />
        <div className="p-4">
          <h2>Adamantine</h2>
          <p className="text-2xl">
            Adamantine was a jet-black alloy of adamant and other metals.
            Usually black in color, adamantine had a green sheen when viewed by
            candlelight or a purple-white sheen when viewed by magical light.[2]
          </p>
        </div>
      </div>
    </div>
  );
};
