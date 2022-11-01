import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';

import Image from 'next/image';
import React, { useState } from 'react';
import { battalionInformation, getUnitImage } from '@/constants/army';
import { buildingIdToString } from '@/constants/buildings';

import { CostBlock } from '@/shared/Getters/Realm';
import type { BattalionInterface } from '@/types/index';

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

const MAX_BATTALIONS = 30;

export const BattalionWithImage: React.FC<
  BattalionInterface & {
    add?: (id) => void;
    quantity;
    health;
    disabled?;
    show?: boolean;
  }
> = (props) => {
  const data = battalionInformation.find((a) => a.id === props.battalionId);

  return (
    <Card
      key={props.battalionId}
      className={`relative flex-col justify-between group h-56 ${data?.color}`}
    >
      <h2 className="z-10 flex justify-center text-center  text-shadow-[0_2px_6px_#6366f1]">
        {data?.name}
      </h2>
      <div className="z-10 mt-auto">
        <div className="flex justify-between px-2 space-x-3 text-center text-white border rounded shadow-xl bg-white/50 border-white/20 bg-blur-lg">
          <div>
            <h2 className="text-shadow-[0_2px_6px_#6366f1]">
              {props.quantity || 0}
            </h2>
          </div>
          <div>
            <h2 className="text-shadow-[0_2px_6px_#6366f1]">
              {props.health || 0} hp
            </h2>
          </div>
        </div>
      </div>

      <Image
        src={getUnitImage(props.battalionId)}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 w-full h-full"
        alt={props.battalionName}
      />
    </Card>
  );
};
