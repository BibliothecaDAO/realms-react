import { useUIContext } from "~/hooks/useUIContext";
import { TheOrders, OrderDetails } from "~/util/theOrders";
import {
  JSXElementConstructor,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import Left from "../../../public/svg/chevron-left.svg";
import Right from "../../../public/svg/chevron-right.svg";
import Menu from "../../../public/svg/menu.svg";
import { OrderIcon } from "~/shared/OrderIcon";
import { BaseSideBar } from "./BaseSideBar";

type Props = {
  onClick: (event: any, id: string) => void;
};

export const TheOrdersSideBar = (props: Props) => {
  const { toggleTheOrdersMenu, theOrdersMenu } = useUIContext();
  const [focusOrder, setOrder] = useState<number>(0);

  const changeOrder = (value: any) => {
    if (focusOrder === 15 && value > 0) {
      setOrder(() => 1);
    } else if (focusOrder === 1 && value === -1) {
      setOrder(() => 15);
    } else {
      setOrder(() => focusOrder + value);
    }
  };

  return (
    <BaseSideBar open={theOrdersMenu}>
      <div className="z-20 w-full h-screen p-6 pt-10 overflow-auto sm:w-1/3 rounded-r-2xl">
        <button
          className="z-10 p-4 mb-8 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={toggleTheOrdersMenu}
        >
          <Menu />
        </button>
        <div className="flex justify-between">
          <h4 className="self-center mb-4 uppercase">Order Details</h4>
          <div className="mb-4 space-x-2">
            <button
              className="p-2 rounded-full bg-white/30 hover:bg-white/70"
              onClick={() => changeOrder(-1)}
            >
              <Left />
            </button>
            <button
              className="p-2 rounded-full bg-white/30 hover:bg-white/70"
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
          <h4 className="my-2 font-semibold uppercase font-body">
            Attunement: {OrderDetails[focusOrder]?.attunement}
          </h4>
          <p className="sm:text-2xl">{OrderDetails[focusOrder]?.description}</p>
          <hr className="my-4" />
          <h4 className="my-2 mt-4 font-semibold uppercase font-body">
            Order Wonders
          </h4>

          <div className="flex flex-wrap">
            {OrderDetails[focusOrder]?.wonders.name.map((a: any, index) => {
              return (
                <div key={index} className="px-2 mb-2">
                  <button
                    className="p-4 rounded sm:text-xl hover:bg-white/60 bg-white/20 font-display "
                    onClick={() =>
                      props.onClick(
                        OrderDetails[focusOrder]?.wonders.realm_id[index],
                        "A"
                      )
                    }
                  >
                    <span className="text-xl sm:text-3xl">{a}</span>

                    <br />
                    <span>
                      {OrderDetails[focusOrder]?.wonders.realm_name[index]} |{" "}
                      {OrderDetails[focusOrder]?.wonders.realm_id[index]}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          <hr className="my-4" />
          <h4 className="my-2 mt-4 font-semibold uppercase font-body">
            Order Genesis Adventurers
          </h4>
          <div className="flex flex-wrap">
            {OrderDetails[focusOrder]?.notable_gas.name.map((a, index) => {
              return (
                <a
                  className="px-4 py-2 mb-2 mr-2 uppercase rounded sm:text-xl hover:bg-white/60 bg-white/20 font-display"
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
    </BaseSideBar>
  );
};
