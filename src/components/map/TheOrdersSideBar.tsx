import { useUIContext } from "~/hooks/useUIContext";
import { TheOrders, OrderDetails } from "~/util/theOrders";
import { JSXElementConstructor, MouseEventHandler, useState } from "react";
import Left from "../../../public/svg/chevron-left.svg";
import Right from "../../../public/svg/chevron-right.svg";
import Power from "../../../public/svg/orders/power.svg";
import Anger from "../../../public/svg/orders/anger.svg";
import Brilliance from "../../../public/svg/orders/brilliance.svg";
import Detection from "../../../public/svg/orders/detection.svg";
import Enlightenment from "../../../public/svg/orders/enlightenment.svg";
import Fox from "../../../public/svg/orders/fox.svg";
import Fury from "../../../public/svg/orders/fury.svg";
import Giants from "../../../public/svg/orders/giants.svg";
import Perfection from "../../../public/svg/orders/perfection.svg";
import Rage from "../../../public/svg/orders/rage.svg";
import Reflection from "../../../public/svg/orders/reflection.svg";
import Skill from "../../../public/svg/orders/skill.svg";
import Titans from "../../../public/svg/orders/titans.svg";
import Twins from "../../../public/svg/orders/twins.svg";
import Vitriol from "../../../public/svg/orders/vitriol.svg";
import Protection from "../../../public/svg/orders/protection.svg";
type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  resource: Array<String>;
};

const Components = Object.freeze({
  power: <Power />,
  anger: <Anger />,
  brilliance: <Brilliance />,
  detection: <Detection />,
  enlightenment: <Enlightenment />,
  "the fox": <Fox />,
  fury: <Fury />,
  giants: <Giants />,
  perfection: <Perfection />,
  reflection: <Reflection />,
  skill: <Skill />,
  titans: <Titans />,
  "the twins": <Twins />,
  vitriol: <Vitriol />,
  rage: <Rage />,
  protection: <Protection />,
});

export const TheOrdersSideBar = () => {
  const { toggleTheOrdersMenu, theOrdersMenu } = useUIContext();
  const [focusOrder, setOrder] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  const changeOrder = (value: any) => {
    setLoaded(false);
    console.log(focusOrder);
    if (focusOrder === 15 && value > 0) {
      setOrder(() => 1);
    } else if (focusOrder === 1 && value === -1) {
      setOrder(() => 15);
    } else {
      setOrder(() => focusOrder + value);
    }
  };

  return (
    <div className="">
      <div
        className={`h-screen w-full sm:w-1/3 z-40 absolute p-6 bottom-0 backdrop-blur-md bg-off-200/30 rounded-r-2xl transform duration-300 transition-all  overflow-x-hidden right-0    ${
          theOrdersMenu ? "" : "translate-y-full hidden"
        }`}
      >
        <button
          className="bg-white/20 transition-all p-4 z-10 rounded hover:bg-white/70 mb-8"
          onClick={toggleTheOrdersMenu}
        >
          Close
        </button>
        <div className="flex justify-between">
          <h4 className="uppercase mb-4 self-center">Order Details</h4>
          <div className="space-x-2 mb-4">
            <button
              className="rounded-full bg-white/30 p-2 hover:bg-white/70"
              onClick={() => changeOrder(-1)}
            >
              <Left />
            </button>
            <button
              className="rounded-full bg-white/30 p-2 hover:bg-white/70"
              onClick={() => changeOrder(1)}
            >
              <Right />
            </button>
          </div>
        </div>
        <div className="py-4">
          {/* <h4>{OrderDetails[focusOrder]?.order_id}</h4> */}

          <div className="my-4">
            {/* @ts-ignore: name not exist on D */}
            {Components[OrderDetails[focusOrder]?.order]}
          </div>

          <h1 className="mt-2 mb-4 capitalize">
            Order of {OrderDetails[focusOrder]?.order}
          </h1>
          <h4 className="uppercase font-body my-2 font-semibold">
            Attunement: {OrderDetails[focusOrder]?.attunement}
          </h4>
          <h4 className="uppercase font-body my-2 font-semibold">
            Paired Order: {OrderDetails[focusOrder]?.paired_order}
          </h4>
          <p className="text-2xl">{OrderDetails[focusOrder]?.description}</p>
          <hr className="my-4" />
          <h4 className="uppercase font-body my-2 mt-4 font-semibold">
            Order Wonders
          </h4>

          <div className="flex flex-wrap">
            {OrderDetails[focusOrder]?.wonders.name.map((a, index) => {
              return (
                <span
                  className="px-4 mb-2 py-1 bg-white/20 mr-2 text-xl rounded font-display uppercase"
                  key={index}
                >
                  {a}
                </span>
              );
            })}
          </div>
          <hr className="my-4" />
          <h4 className="uppercase font-body my-2 mt-4 font-semibold">
            Order Genesis Adventurers
          </h4>
          <div className="flex flex-wrap">
            {OrderDetails[focusOrder]?.notable_gas.name.map((a, index) => {
              return (
                <div
                  className="px-4 py-2 bg-white/20 mr-2 text-xl rounded font-display uppercase mb-2"
                  key={index}
                >
                  {a}
                  <span>
                    <a
                      target={"_blank"}
                      href={OrderDetails[focusOrder]?.notable_gas.link[index]}
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
