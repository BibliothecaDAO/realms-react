import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';

import React, { useState, useEffect } from 'react';
import { battalionInformation } from '@/constants/army';
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
    quantity;
    health;
    disabled?;
    show?: boolean;
  }
> = (props) => {
  const data = battalionInformation.find((a) => a.id === props.battalionId);

  const [input, setInput] = useState('1');

  return (
    <Card
      key={props.battalionId}
      className={`relative flex-col group ${data?.color}`}
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

      <CardTitle className="flex justify-center text-center">
        {data?.name}
      </CardTitle>
      <CardBody>
        <div className="flex justify-center space-x-3 text-center">
          <div className="px-4 border-r">
            <h5 className="">qty</h5>
            <h1>{props.quantity || 0}</h1>
          </div>
          <div className="pr-4">
            <h5 className="">health</h5>
            <h1>{props.health || 0}</h1>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
