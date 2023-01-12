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
import { buildingIdToString, MAX_BATTALIONS } from '@/constants/globals';

import type { BattalionInterface } from '@/types/index';

type Battalion = {
  battalionId: number;
  battalionName: string;
  battalionQty: number;
};

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
      className={`relative flex-col group p-3 rounded ${data?.color} shadow-red-900/30 shadow-xl border-yellow-800/40 border-4`}
    >
      <div className="flex justify-between">
        <Image
          height={130}
          width={130}
          className="self-center object-fill bg-white border border-yellow-900 rounded shadow-inner"
          src={getUnitImage(props.battalionId)}
          alt=""
        />
        <div className="p-3">
          {data?.id && (
            <span className="text-3xl">{battalionIdToString(data.id)}</span>
          )}
          <div className="flex flex-col">
            <div className="w-full text-xl">
              <span>Currently: {props.quantity || 0} units</span>
            </div>
            <div className="w-full text-lg">
              <span>Currently: {props.health || 0} hp</span>
            </div>
          </div>
        </div>

        {props.show && (
          <div className="flex flex-col justify-center ml-auto transition-all cursor-pointe">
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
              <div className="px-2 mt-4 text-center text-red-300 border border-red-900 rounded">
                ! Build a {buildingIdToString(props.buildingId || 0)} First
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
