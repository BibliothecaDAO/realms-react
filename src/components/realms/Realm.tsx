import { ReactElement } from "react";
import React from "react";
import { Realm } from "../../types";
import { Resources } from "~/util/resources";
import { TheOrders } from "~/util/theOrders";
import { RealmProps } from "../../types";
import { shortenAddress } from "~/util/formatters";
import { OrderIcon } from "~/shared/OrderIcon";
export function Realm(props: RealmProps): ReactElement {
  const findResourceName = (value: any) => {
    return Resources.find((e) => e.id === parseInt(value));
  };
  return (
    <div className="rounded-xl p-1 sm:p-4 h-auto z-10text-white">
      {props.loading ? (
        <div>
          <div className="pt-20 h-64 bg-white/40 w-full rounded animate-pulse mb-4" />
          <div className="pt-20 h-32 bg-white/40 w-full rounded animate-pulse mb-4" />
          <div className="pt-20 h-32 bg-white/40 w-full rounded animate-pulse" />
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <OrderIcon order={props.data.realm.order.toLowerCase()} />
          </div>

          <div
            className={`w-full text-center rounded-lg py-2 text-2xl uppercase tracking-widest`}
          >
            Order of {props.data.realm.order}
          </div>
          {props.data.realm?.wonder ? (
            <div className="w-full text-center bg-white/30 p-4 uppercase text-3xl rounded">
              {props.data.realm?.wonder}
            </div>
          ) : (
            ""
          )}

          <img
            src={`https://d23fdhqc1jb9no.cloudfront.net/_Renders/${props.data.realm.id}.jpg`}
            alt="map"
            className="w-full rounded-xl mt-4"
          />
          <div className="p-2">
            <h3 className="my-4 ">
              👑 {shortenAddress(props.data.realm.currentOwner.address)}
            </h3>
            <h4>Id: {props.data.realm.id}</h4>

            <h1 className="mt-2 mb-4">{props.data.realm.name}</h1>
            <div className="flex flex-wrap mb-2">
              {props.data.realm.resourceIds.map((re: any, index) => (
                <span
                  className={`uppercase px-4 py-1 rounded mr-2 mb-2 tracking-widest sm:text-xl ${
                    findResourceName(re)?.colourClass
                  }`}
                  key={index}
                >
                  {findResourceName(re)?.trait}
                </span>
              ))}
            </div>

            <div className="flex flex-col w-full sm:text-2xl uppercase">
              <span>Regions: {props.data.realm.regions} / 7</span>
              <div className="w-full bg-gray-200 rounded my-2">
                <div
                  className="bg-amber-700/60 h-2 rounded-xl"
                  style={{
                    width: `${((props.data.realm.regions as any) / 7) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="pt-1">
                Cities: {props.data.realm.cities} / 21
              </span>
              <div className="w-full bg-gray-200 rounded my-2">
                <div
                  className="bg-amber-300/60 h-2 rounded-xl"
                  style={{
                    width: `${((props.data.realm.cities as any) / 21) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="pt-1">
                Harbors: {props.data.realm.harbours} / 35
              </span>
              <div className="w-full bg-gray-200 rounded my-2">
                <div
                  className="bg-blue-700/60 h-2 rounded-xl"
                  style={{
                    width: `${
                      ((props.data.realm.harbours as any) / 35) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="pt-1">
                Rivers: {props.data.realm.rivers} / 60
              </span>
              <div className="w-full bg-gray-200 rounded my-2">
                <div
                  className="bg-blue-500/60 h-2 rounded-xl"
                  style={{
                    width: `${((props.data.realm.rivers as any) / 60) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="py-4">
              <a
                className="text-xl"
                target={"_blank"}
                href={
                  "https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/" +
                  props.data.realm.id
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
