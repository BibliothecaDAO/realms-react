import {
  Button,
  Select,
  ResourceIcon,
  InputNumber,
  IconButton,
} from '@bibliotheca-dao/ui-lib';

import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';

import LordsIcon from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';

import { useState, useCallback, useEffect } from 'react';
import type { ReactElement } from 'react';

const resources = [
  'Wood',
  'Stone',
  'Coal',
  'Copper',
  'Obsidian',
  'Silver',
  'Ironwood',
  'Cold Iron',
  'Gold',
  'Hartwood',
  'Diamonds',
  'Sapphire',
  'Ruby',
  'Deep Crystal',
  'Ignium',
  'Ethereal Silica',
  'True Ice',
  'Twilight Quartz',
  'Alchemical Silver',
  'Adamantine',
  'Mithral',
  'Dragonhide',
];

type Resources = typeof resources[number];

type ResourceQty = {
  name: Resources;
  qty: string | number;
};
type ResourceRowProps = {
  resource: ResourceQty;
  availableResources: Resources[];
  onResourceChange: (name: string, newName: string) => void;
  onQtyChange: ({ name, qty }: ResourceQty) => void;
};

const ResourceRow = (props: ResourceRowProps): ReactElement => {
  const [resourceQty, setResourceQty] = useState<string | number>(0);
  const [time, setTime] = useState<NodeJS.Timeout | null>(null);

  const validateInputValue = useCallback(
    (value: string | number) => {
      /* return new BigNumber(
        new BigNumber(value).toFixed(
          stakingToken ? stakingToken.decimals : DEFAULT_TOKEN_POWER
        )
      ); */
      return value;
    },
    [
      /* stakingToken */
    ]
  );

  const updateInputValue = useCallback(
    (newValue: string | number) => {
      props.onQtyChange({
        name: props.resource.name,
        qty: validateInputValue(newValue),
      });
    },
    [validateInputValue]
  );

  const handleValueChange = (newValue: ValueType | null) => {
    if (newValue === null) return;
    if (time) {
      clearTimeout(time);
    }
    let timerId: NodeJS.Timeout | null = null;
    timerId = setTimeout(() => {
      props.onQtyChange({
        name: props.resource.name,
        qty: newValue as number,
      }); /* updatePercentByValue(newValue); */
    }, 500);
    setTime(timerId);
  };
  const handleSelectChange = (newValue: Resources) => {
    console.log(handleSelectChange);
    props.onResourceChange(props.resource.name, newValue);
  };
  return (
    <div className="flex p-3 mb-4 rounded shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.3)] bg-gray-900/70">
      <div className="sm:w-1/2">
        <Select
          optionIcons={true}
          value={props.resource.name}
          onChange={handleSelectChange}
        >
          <Select.Button
            label={props.resource.name}
            variant={props.resource.name ? 'default' : 'placeholder'}
            icon={
              <ChevronRight className="w-5 h-5 text-white transform -rotate-90" />
            }
            labelIcon={
              <ResourceIcon size="sm" resource={props.resource.name} />
            }
          />
          <Select.Options>
            {props.availableResources.map((resource, idx) => (
              <Select.Option
                key={idx}
                value={resource}
                label={resource}
                selectedIcon={<ChevronRight />}
                icon={<ResourceIcon size="sm" resource={resource} />}
              />
            ))}
          </Select.Options>
        </Select>
        <div className="flex justify-between pt-1.5 text-xs">
          <div>MAX: 900</div>
          <div>1 = 1.01</div>
        </div>
      </div>
      <div className="flex justify-end text-right sm:w-1/2">
        <div className="flex flex-col justify-between">
          <InputNumber
            value={props.resource.qty}
            inputSize="md"
            colorScheme="transparent"
            className="w-20 text-2xl font-semibold text-right shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.3)] mb-2"
            /* inputPrefix={/* <span className="text-md text-gray">
            ~{value} {mockData.additionalCurrency}
          </span>} 
        prefixPosition="button" */
            min={0}
            max={10000}
            stringMode // to support high precision decimals
            onChange={handleValueChange}
          />{' '}
          <div className="flex justify-end">
            <span className="mr-1">146.4</span>{' '}
            <LordsIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export function SwapResources(): ReactElement {
  const [resourceRows, setResourceRows] = useState<ResourceQty[]>([]);
  const handleAddRow = () => {
    setResourceRows((prevRows) => [
      ...prevRows,
      {
        name: availableResources[0],
        qty: 0, // Random age
      },
    ]);
  };
  const handleRemoveRow = (name: Resources) => {
    setResourceRows(resourceRows.filter((item) => item.name !== name));
  };
  const [availableResources, setAvailableResources] =
    useState<Resources[]>(resources);

  useEffect(() => {
    const resourceRowNames = resourceRows.map((i) => {
      return i.name;
    });
    setAvailableResources(
      resources.filter(function (el) {
        return resourceRowNames.indexOf(el) < 0;
      })
    );
  }, [resourceRows]);

  const handleQtyChange = ({ name, qty }: ResourceQty) => {
    console.log(resourceRows);
    setResourceRows(
      resourceRows.map((resourceRow) =>
        resourceRow.name === name
          ? { ...resourceRow, qty: qty }
          : { ...resourceRow }
      )
    );
  };
  const handleResourceChange = (name: string, newName: string) => {
    setResourceRows(
      resourceRows.map((resourceRow) =>
        resourceRow.name === name
          ? { ...resourceRow, name: newName, qty: 0 }
          : { ...resourceRow }
      )
    );
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {resourceRows.map((resourceRow) => (
          <div className="relative" key={resourceRow.name}>
            <ResourceRow
              key={resourceRow.name}
              resource={resourceRow}
              availableResources={availableResources}
              onResourceChange={handleResourceChange}
              onQtyChange={handleQtyChange}
            />
            <IconButton
              className="absolute -top-3 -right-3"
              icon={<Danger className="w-3 h-3" />}
              aria-label="Remove Row"
              size="xs"
              onClick={() => handleRemoveRow(resourceRow.name)}
            />
          </div>
        ))}
        <IconButton
          aria-label="Add Row"
          icon={<ChevronRight className="w-8 h-8" />}
          size="lg"
          onClick={() => handleAddRow()}
        />
      </div>
      <div className="flex justify-end w-full pt-4">
        <div className="flex flex-col justify-end w-full pb-16">
          <div className="flex flex-col  rounded p-4 mb-5 bg-gray-500/70 shadow-[inset_0_6px_8px_0px_rgba(0,0,0,0.18)]">
            <div className="flex justify-end text-2xl font-semibold">
              <span className="mr-1">422.2</span>
              <LordsIcon className="w-6 h-6 mt-0.5" />
            </div>
            <div className="flex justify-end text-md">10,000</div>
          </div>

          <Button className="w-full" variant="primary">
            Trade
          </Button>
        </div>
      </div>
    </div>
  );
}
