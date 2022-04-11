import { Button } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';
import { RangeSliderFilter } from './RangeSliderFilter';

const SizeMax = 24;
const NumDoorsMax = 12;
const NumPointsMax = 13;

type Stats = {
  size: number;
  numDoors: number;
  numPoints: number;
};

type CryptStatsFilterProps = {
  stats: Stats;
  onChange(stats: Stats): void;
};

export function CryptStatsFilter(props: CryptStatsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef(null);
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const onSizeFilterChange = (value: number) => {
    const updatedStats = { ...props.stats, size: value };
    props.onChange(updatedStats);
  };

  const onNumDoorsFilterChange = (value: number) => {
    const updatedStats = { ...props.stats, numDoors: value };
    props.onChange(updatedStats);
  };

  const onNumPointsFilterChange = (value: number) => {
    const updatedStats = { ...props.stats, numPoints: value };
    props.onChange(updatedStats);
  };

  const hasSelectedFilters =
    props.stats.numDoors > 0 ||
    props.stats.numPoints > 0 ||
    props.stats.size > 0;

  return (
    <Popover className="relative">
      <div ref={ref}>
        <Button
          variant="primary"
          size="sm"
          className={clsx(hasSelectedFilters ? 'bg-black' : '')}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          STATS
        </Button>

        {isOpen && (
          <Popover.Panel
            className="absolute z-10 m-auto mt-2 md:right-0 "
            static
          >
            <div className="flex flex-col px-8 py-4 pb-6 font-medium text-white bg-black rounded-sm shadow-sm w-60">
              <div className="mb-3 text-lg text-center uppercase">Stats</div>
              <RangeSliderFilter
                name="Size"
                min={0}
                max={SizeMax}
                defaultValue={props.stats.size}
                onChange={onSizeFilterChange}
              />
              <RangeSliderFilter
                name="Doors"
                min={0}
                max={NumPointsMax}
                defaultValue={props.stats.numPoints}
                onChange={onNumDoorsFilterChange}
              />
              <RangeSliderFilter
                name="Points"
                min={0}
                max={NumDoorsMax}
                defaultValue={props.stats.numDoors}
                onChange={onNumPointsFilterChange}
              />
            </div>
          </Popover.Panel>
        )}
      </div>
    </Popover>
  );
}
