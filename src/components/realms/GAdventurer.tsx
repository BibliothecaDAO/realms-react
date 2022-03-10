import { ReactElement, useState, useEffect } from "react";
import { rarityDescription, rarityColor } from "loot-rarity";
import { GAProps } from "../../types";
import { shortenAddress } from "~/util/formatters";
import Image from "next/image";
import getGreatness from "~/services/getGreatness";
import { OrderIcon } from "~/shared/OrderIcon";

const variantMaps: any = {
  small: { heading: "lg:text-4xl", regions: "lg:text-xl" },
};

export function GAdventurer(props: GAProps): ReactElement {
  const image = props.ga.id;
  const [metaData, setMetaData] = useState(null);
  const mappedProperties = [
    "weapon",
    "chest",
    "head",
    "waist",
    "foot",
    "hand",
    "neck",
    "ring",
  ];

  useEffect(() => {
    const getMetadata = async () => {
      setMetaData(getGreatness(props.ga.id));
    };

    if (props.ga.id) {
      getMetadata();
    }
  }, [props.ga.id]);

  return (
    <div className="z-10 w-full h-auto p-1 text-white rounded-xl sm:p-4">
      {props.loading ? (
        <div className="">
          <div className="w-full h-64 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 rounded bg-white/40 animate-pulse" />
        </div>
      ) : (
        <div className="pt-4">
          <div className="flex justify-center">
            <OrderIcon order={props.ga.order.toLowerCase()} />
          </div>

          <div
            className={`w-full text-center rounded-lg py-2 text-2xl uppercase tracking-widest`}
          >
            Order of {props.ga.order}
          </div>
          <div className=" sm:text-2xl">
            <div className="flex flex-col flex-wrap justify-between my-4 rounded sm:flex-row">
              <h2>
                Id: <span className="font-semibold ">{props.ga.id}</span>
              </h2>
              {props.ga.currentOwner && (
                <h3 className="my-3">
                  👑 {shortenAddress(props.ga.currentOwner.address)}
                </h3>
              )}
              {props.flyto && (
                <div className="self-center text-lg">
                  <button
                    className={
                      "bg-white/20 rounded px-4 uppercase hover:bg-white/40"
                    }
                    onClick={() => {
                      if (props.onClick) props.onClick(props.ga.id, "C");
                    }}
                  >
                    fly to
                  </button>
                </div>
              )}
            </div>
            <table className="min-w-full pb-4 rounded table-auto bg-black/70">
              <thead>
                <tr>
                  <th className="p-4 pl-6 text-left uppercase">Item</th>
                  <th className="p-4 uppercase">Greatness</th>
                </tr>
              </thead>
              <tbody>
                {mappedProperties.map((item, index) => (
                  <tr key={index}>
                    <td className="pb-5 pl-6">
                      <p className="text-xs sm:text-lg font-medium tracking-wider text-left  uppercase ">
                        <span className="dark:text-gray-400 text-gray-400">
                          {item}{" "}
                        </span>
                        <span
                          className={
                            "px-2 py-1 rounded bg-[" +
                            rarityColor((props.ga as any)[item]) +
                            "]"
                          }
                        >
                          {rarityDescription((props.ga as any)[item])}
                        </span>{" "}
                      </p>
                      <p
                        className={
                          "mt-1 font-semibold text-[" +
                          rarityColor((props.ga as any)[item]) +
                          "]"
                        }
                      >
                        {(props.ga as any)[item]}
                      </p>
                    </td>

                    <td className="text-center">
                      {metaData
                        ? (metaData as any).greatness[item.toLowerCase()]
                        : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xl"></div>
            <div className="py-4">
              <a
                className="text-xl"
                target={"_blank"}
                href={
                  "https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/" +
                  props.ga.id
                }
                rel="noreferrer"
              >
                View on Opensea
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
