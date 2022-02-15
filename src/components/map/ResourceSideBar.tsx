import { useUIContext } from "~/hooks/useUIContext";
import { resources } from "~/resources";
import { MouseEventHandler } from "react";
type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  resource: Array<String>;
};

export const ResourceSideBar = (props: Props) => {
  const { toggleResourceMenu, resourceMenu } = useUIContext();

  const list = resources.map((res: any, index) => (
    <button
      key={index}
      className={` p-1 h-12 mb-2 pl-4 pr-2 rounded-xl text-off-200 mr-2 hover:bg-white/90 transition-all duration-300   ${
        props.resource.includes(res.trait)
          ? "backdrop-blur-md bg-white/90"
          : "backdrop-blur-md bg-white/30"
      } `}
      onClick={() => props.onClick(res.trait)}
    >
      {res.trait}{" "}
      <span className="p-1 bg-white/30 rounded-lg ml-2">{res.value}</span>
    </button>
  ));

  return (
    <div className="">
      <button
        className="absolute top-10 right-10 bg-white/50 transition-all p-4 z-10 rounded hover:bg-white/70"
        onClick={toggleResourceMenu}
      >
        Resources
      </button>

      <div
        className={`h-screen w-full sm:w-1/3 z-40 absolute p-6 bottom-0 backdrop-blur-md bg-off-200/30 rounded-r-2xl transform duration-300 transition-all  overflow-x-hidden right-0    ${
          resourceMenu ? "" : "translate-y-full hidden"
        }`}
      >
        <button
          className="bg-white/20 transition-all p-4 z-10 rounded hover:bg-white/70 mb-8"
          onClick={toggleResourceMenu}
        >
          Close
        </button>
        <h1 className="mb-4">Resources</h1>
        <h4 className="uppercase mb-4">Filter</h4>
        <div className="flex flex-wrap mb-8">{list}</div>
        <h4 className="uppercase mb-4">Details</h4>
        <img
          src="https://github.com/BibliothecaForAdventurers/voxel-resources/blob/main/adamantine.gif?raw=true"
          alt=""
          className="w-full rounded-xl"
        />
        <div className="py-4">
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
