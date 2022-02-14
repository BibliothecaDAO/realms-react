import { ReactElement } from "react";
import React from "react";
import { Realm } from "../../types";
import Image from "next/image";
import { RealmProps } from "../../types";

export function Realm(props: RealmProps): ReactElement {
  return (
    <div className="">
      {props.loading ? (
        <p className="pt-20 h-48 w-48">Loading...</p>
      ) : (
        <div className="pt-20">
          <img
            src={`https://d23fdhqc1jb9no.cloudfront.net/_Renders/${props.data.realm.id}.jpg`}
            alt="map"
            className="w-full"
          />
          <div className="p-2">
            <h1>{props.data.realm.name}</h1>
            <div className="flex flex-col w-full text-sm">
              <span>Regions</span>
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-amber-500 h-1"
                  style={{
                    width: ((props.data.realm.regions as any) / 7) * 100,
                  }}
                ></div>
              </div>
              <span className="pt-1 text-sm">Cities</span>
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-amber-800 h-1"
                  style={{
                    width: ((props.data.realm.cities as any) / 21) * 100,
                  }}
                ></div>
              </div>
              <span className="pt-1">Harbors</span>
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-blue-600 h-1"
                  style={{
                    width: ((props.data.realm.harbours as any) / 35) * 100,
                  }}
                ></div>
              </div>
              <span className="pt-1">Rivers</span>
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-blue-400 h-1"
                  style={{
                    width: ((props.data.realm.rivers as any) / 60) * 100,
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
