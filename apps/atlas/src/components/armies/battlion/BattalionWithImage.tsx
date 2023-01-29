import Image from 'next/image';
import React from 'react';
import { HealthBar } from '@/components/armies/BattalionImagesCard';
import { battalionInformation, getUnitImage } from '@/constants/army';
import type { BattalionInterface } from '@/types/index';

export const BattalionWithImage: React.FC<
  BattalionInterface & {
    add?: (id) => void;
    quantity;
    health;
    disabled?;
    show?: boolean;
  }
> = (props) => {
  return (
    <div
      key={props.battalionId}
      className={`border border-yellow-900/30 relative flex-col justify-between group h-36 rounded-md`}
    >
      {/* <h2 className="z-20 flex justify-center text-center  text-shadow-[0_2px_6px_#6366f1] absolute">
        {data?.name}
      </h2> */}
      {/* <div className="absolute z-10 mt-auto">
        <div className="flex justify-between px-2 space-x-3 text-center text-white border rounded shadow-xl bg-white/50 border-white/20 bg-blur-lg">
          <div>
            <h2 className="text-shadow-[0_2px_6px_#6366f1]">
              {props.health || 0} hp
            </h2>
          </div>
        </div>
      </div> */}
      <HealthBar
        troopId={props.battalionId}
        health={props.health}
        baseHealth={100} // TODO add base amount of health (unit health * qty)
        className="absolute z-10 px-1 py-2"
      />
      <div className="absolute z-10 flex justify-between p-2 mt-auto text-center rounded-full bg-gray-1000/90 left-2 bottom-2">
        <h4 className="">{props.quantity || 0}</h4>
      </div>

      <Image
        src={getUnitImage(props.battalionId)}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 w-full h-full rounded"
        alt=""
      />
    </div>
  );
};
