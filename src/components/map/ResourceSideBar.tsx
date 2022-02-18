import { useUIContext } from "~/hooks/useUIContext";
import { Resources } from "~/util/resources";
import { MouseEventHandler, useState } from "react";
import Left from "../../../public/svg/chevron-left.svg";
import Right from "../../../public/svg/chevron-right.svg";
type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  resource: Array<String>;
};

export const ResourceSideBar = (props: Props) => {
  const { toggleResourceMenu, resourceMenu } = useUIContext();
  const [focusResource, setResource] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const list = Resources.map((res: any, index) => (
    <button
      key={index}
      className={`  p-1 mb-2 pl-4 pr-4 rounded-xl tracking-widest  mr-2 hover:bg-white/90 transition-all duration-150 py-2 uppercase font-body hover:background-animate bg-white/30 ${
        props.resource.includes(res.trait)
          ? `background-animate ${res.colourClass} `
          : "text-gray-700"
      } `}
      onClick={() => props.onClick(res.trait)}
    >
      {res.trait}{" "}
      <span className="p-1 bg-white/30 rounded-lg ml-2">{res.value}</span>
    </button>
  ));

  const changeResource = (value: any) => {
    setLoaded(false);
    console.log(focusResource);
    if (focusResource === 21 && value > 0) {
      setResource(() => 1);
    } else if (focusResource === 1 && value === -1) {
      setResource(() => 21);
    } else {
      setResource(() => focusResource + value);
    }
  };
  return (
    <div className="">
      <div
        className={`h-screen w-full sm:w-1/3 z-40 absolute p-6 bottom-0 backdrop-blur-md bg-off-200/30 rounded-r-2xl transform duration-150 transition-all  overflow-x-hidden right-0    ${
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
        <div className="flex justify-between">
          <h4 className="uppercase mb-4 self-center">Details</h4>
          <div className="space-x-2 mb-4">
            <button
              className="rounded-full bg-white/30 p-2 hover:bg-white/70"
              onClick={() => changeResource(-1)}
            >
              <Left />
            </button>
            <button
              className="rounded-full bg-white/30 p-2 hover:bg-white/70"
              onClick={() => changeResource(1)}
            >
              <Right />
            </button>
          </div>
        </div>
        {loaded ? (
          <div></div>
        ) : (
          <div className="h-96 animate-pulse w-full bg-gray-200 rounded-xl"></div>
        )}

        <img
          src={Resources[focusResource]?.img}
          alt=""
          className={`w-full rounded-xl ${loaded ? "" : "hidden"}`}
          onLoad={() => setLoaded(true)}
        />
        <div className="py-4">
          <h4>Found on: {Resources[focusResource]?.value} Realms</h4>
          <h2 className="mt-2 mb-4">{Resources[focusResource]?.trait}</h2>
          <p className="text-2xl">{Resources[focusResource]?.description}</p>
        </div>
      </div>
    </div>
  );
};
