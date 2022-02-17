import { useUIContext } from "~/hooks/useUIContext";
import { TheOrders, OrderDetails } from "~/util/theOrders";
import { JSXElementConstructor, MouseEventHandler, useState } from "react";
import Left from "../../../public/svg/chevron-left.svg";
import Right from "../../../public/svg/chevron-right.svg";
import { OrderIcon } from "~/shared/OrderIcon";
type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const TheOrdersSideBar = (props: Props) => {
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
        className={`h-screen w-full sm:w-1/3 z-40 absolute p-6 bottom-0 backdrop-blur-lg bg-off-200/30 rounded-r-2xl transform duration-300 transition-all  overflow-x-hidden right-0    ${
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
          {/* @ts-ignore: name not exist on D */}
          <OrderIcon order={OrderDetails[focusOrder]?.order} />

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
            {OrderDetails[focusOrder]?.wonders.name.map((a: any, index) => {
              return (
                <div key={index} className="w-1/2 px-2 mb-2">
                  <button
                    className="p-4 hover:bg-white/60 bg-white/20 text-xl rounded font-display uppercase"
                    onClick={() =>
                      props.onClick(
                        /* @ts-ignore: name not exist on D */
                        OrderDetails[focusOrder]?.wonders.realm_id[index]
                      )
                    }
                  >
                    {a}
                  </button>
                </div>
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
                <a
                  className="px-4 py-2 hover:bg-white/60 bg-white/20 mr-2 text-xl rounded font-display uppercase mb-2"
                  target={"_blank"}
                  href={OrderDetails[focusOrder]?.notable_gas.link[index]}
                  rel="noreferrer"
                  key={index}
                >
                  {a}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
