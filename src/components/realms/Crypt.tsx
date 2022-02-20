import { ReactElement } from "react";
import React from "react";
import { Realm } from "../../types";
import { Resources } from "~/util/resources";
import { CryptProps } from "../../types";
import { shortenAddress } from "~/util/formatters";
import { OrderIcon } from "~/shared/OrderIcon";
import Image from "next/image";
const variantMaps: any = {
  small: { heading: "lg:text-4xl", regions: "lg:text-xl" },
};

export function Crypt(props: CryptProps): ReactElement {
  const findResourceName = (value: any) => {
    return Resources.find((e) => e.id === parseInt(value));
  };

  const image = props.crypt.svg

  return (
    <div className="z-10 w-full h-auto p-1 text-white rounded-xl sm:p-4">
      {props.loading ? (
        <div className="">
          <div className="w-full h-64 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 rounded bg-white/40 animate-pulse" />
        </div>
      ) : (
        <div>
          {/*<div className="flex justify-center">
            <OrderIcon order={props.crypt.order.toLowerCase()} />
          </div>

          <div
            className={`w-full text-center rounded-lg py-2 text-2xl uppercase tracking-widest`}
          >
            Order of {props.crypt.order}
      </div>*/}

          <div className="w-auto">
            <img src={`data:image/svg+xml;base64,${btoa(image)}`} alt="" width="500" height="320" />
          </div>

          <div className="p-2">
            {props.crypt.currentOwner && (
              <h3 className="my-3">
                👑 {shortenAddress(props.crypt.currentOwner.address)}
              </h3>
            )}


            <h1 className={`mt-2 mb-4 ${variantMaps[props.size]?.heading}`}>
              {props.crypt.name}
            </h1>

                <p>Doors: {props.crypt.numDoors}</p>
                <p>POIs: {props.crypt.numPoints}</p>
                <p>Environment: {props.crypt.environment}</p>
                <p>Size: {props.crypt.size}</p>
            {/*<div className="flex flex-wrap mb-2">
              {props.crypt.resourceIds.map((re: any, index) => (
                <span
                  className={`uppercase px-4 py-1 rounded-lg mr-2 mb-2 tracking-widest ${
                    findResourceName(re)?.colourClass
                  }`}
                  key={index}
                >
                  {findResourceName(re)?.trait}
                </span>
              ))}
            </div>*/}
            <div className="py-4">
              <a
                className="text-xl"
                target={"_blank"}
                href={
                  "https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/" +
                  props.crypt.id
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
