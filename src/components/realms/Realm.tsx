import { ReactElement } from "react";
import React from "react";
import { Realm } from "../../types";
import { Resources } from "~/util/resources";
import { TheOrders } from "~/util/theOrders";
import { RealmProps } from "../../types";
import { shortenAddress } from "~/util/formatters";
export function Realm(props: RealmProps): ReactElement {
  const findResourceName = (value: any) => {
    return Resources.find((e) => e.id === parseInt(value));
  };
  const findOrderName = (value: any) => {
    return TheOrders.find((e) => e.name.includes(value));
  };
  return (
    <div className="rounded-xl p-4 h-auto  z-10 bg-black/10  text-white">
      {props.loading ? (
        <p className="pt-20 h-48 w-48">Loading...</p>
      ) : (
        <div>
          <div
            className={`w-full text-center rounded-lg py-2 text-xl`}
            style={{
              background: `${findOrderName(props.data.realm.order)?.colour}`,
            }}
          >
            Order of {props.data.realm.order}
          </div>
          <img
            src={`https://d23fdhqc1jb9no.cloudfront.net/_Renders/${props.data.realm.id}.jpg`}
            alt="map"
            className="w-full rounded-xl mt-4"
          />
          <div className="p-2">
            <h4>Id: {props.data.realm.id}</h4>
            <h4>👑 {shortenAddress(props.data.realm.currentOwner.address)}</h4>

            <h1 className="mt-2 mb-4">{props.data.realm.name}</h1>
            <div className="flex flex-wrap mb-2">
              {props.data.realm.resourceIds.map((re: any, index) => (
                <span
                  className={`uppercase px-2 py-1 rounded border mr-2 mb-2 tracking-wide ${
                    findResourceName(re)?.colourClass
                  }`}
                  key={index}
                >
                  {findResourceName(re)?.trait}
                </span>
              ))}
            </div>

            <div className="flex flex-col w-full text-xl">
              <span>Regions: {props.data.realm.regions}</span>
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-amber-700 h-2 rounded-xl"
                  style={{
                    width: `${((props.data.realm.regions as any) / 7) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="pt-1">Cities: {props.data.realm.cities}</span>
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-amber-300 h-2 rounded-xl"
                  style={{
                    width: `${((props.data.realm.cities as any) / 21) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="pt-1">Harbors: {props.data.realm.harbours}</span>
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-blue-700 h-2 rounded-xl"
                  style={{
                    width: `${
                      ((props.data.realm.harbours as any) / 35) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="pt-1">Rivers: {props.data.realm.rivers}</span>
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-blue-500 h-2 rounded-xl"
                  style={{
                    width: `${((props.data.realm.rivers as any) / 60) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
