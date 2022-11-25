import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';

import React, { useState } from 'react';
import { battalionInformation, battalionIdToString } from '@/constants/army';
import { buildingIdToString } from '@/constants/buildings';

import { CostBlock } from '@/shared/Getters/Realm';
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
      className={`relative flex-col group p-3 rounded ${data?.color}`}
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

      {data?.id && <h3 className="">{battalionIdToString(data.id)}</h3>}
      <CardBody>
        <div className="flex flex-col">
          <div className="w-full">
            <h5>{props.quantity || 0} units</h5>
          </div>
          <div className="w-full">
            <h5>{props.health || 0} hp</h5>
          </div>
        </div>
      </CardBody>
    </div>
  );
};
