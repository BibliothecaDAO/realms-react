import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';

import Image from 'next/image';
import React, { useState } from 'react';
import { CostBlock } from '@/components/realms/RealmsGetters';
import {
  battalionInformation,
  battalionIdToString,
  getUnitImage,
} from '@/constants/army';
import { buildingIdToString } from '@/constants/buildings';

import type { BattalionInterface } from '@/types/index';

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

const MAX_BATTALIONS = 30;

export const Battalion: React.FC<
  BattalionInterface & {
    add?: (id) => void;
    addResources?: (qty) => void;
    quantity;
    health;
    disabled?;
    show?: boolean;
  }
> = (props) => {
  const data = battalionInformation.find((a) => a.id === props.battalionId);

  const [input, setInput] = useState('1');

  return (
    <div
      key={props.battalionId}
      className={`relative flex-col group p-3 rounded ${data?.color} shadow-red-900/30 shadow-xl border-yellow-900 border`}
    >
      {props.show && (
        <div className="absolute z-50 flex flex-col justify-center invisible w-full h-full -m-3 transition-all bg-black cursor-pointer group-hover:visible">
          <div className="flex self-center py-4">
            {props.battalionCost &&
              props.battalionCost.map((b, i) => {
                return (
                  <CostBlock
                    key={i}
                    resourceName={b.resourceName}
                    amount={b.amount}
                    id={b.resourceId}
                    qty={input}
                  />
                );
              })}
            {props.addResources && (
              <Button
                onClick={() => {
                  props.addResources?.(input);
                }}
                size="xs"
                className="ml-2"
                variant="outline"
              >
                Buy
              </Button>
            )}
          </div>
          <div className="flex self-center space-x-3">
            {props.add && (
              <Button
                onClick={() =>
                  props.add?.({
                    battalionId: props.battalionId,
                    battalionName: props.battalionName,
                    battalionQty: input,
                  })
                }
                variant="primary"
                size="xs"
                className="self-center"
                disabled={props.disabled}
              >
                add to army +
              </Button>
            )}
            <InputNumber
              value={input}
              inputSize="md"
              colorScheme="transparent"
              className="self-center w-12 h-full bg-white border rounded border-white/40"
              min={1}
              max={MAX_BATTALIONS}
              stringMode // to support high precision decimals
              onChange={(value: any) => setInput(value)}
            />{' '}
          </div>
          {props.disabled && (
            <div className="mt-4 text-center">
              Build a {buildingIdToString(props.buildingId || 0)} first
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <div>
          {data?.id && <h3 className="">{battalionIdToString(data.id)}</h3>}
          <div className="flex flex-col">
            <div className="w-full text-2xl">
              <span>{props.quantity || 0} units</span>
            </div>
            <div className="w-full text-lg">
              <span>{props.health || 0} hp</span>
            </div>
          </div>
        </div>

        <Image
          height={90}
          width={90}
          className="self-center object-fill bg-white rounded border border-yellow-900 shadow-inner"
          src={getUnitImage(props.battalionId)}
          alt=""
        />
      </div>
    </div>
  );
};
