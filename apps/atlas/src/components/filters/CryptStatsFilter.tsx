import { Button } from '@bibliotheca-dao/ui-lib';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { CryptsMax } from '@/constants/index';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';
import type { MinMaxRange } from '@/types/index';
import { RangeSliderFilter } from './RangeSliderFilter';

type Stats = {
  size: MinMaxRange;
  numDoors: MinMaxRange;
  numPoints: MinMaxRange;
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

  const onSizeFilterChange = (value: number[]) => {
    const updatedStats = {
      ...props.stats,
      size: { min: value[0], max: value[1] },
    };
    props.onChange(updatedStats);
  };

  const onNumDoorsFilterChange = (value: number[]) => {
    const updatedStats = {
      ...props.stats,
      numDoors: { min: value[0], max: value[1] },
    };
    props.onChange(updatedStats);
  };

  const onNumPointsFilterChange = (value: number[]) => {
    const updatedStats = {
      ...props.stats,
      numPoints: { min: value[0], max: value[1] },
    };
    props.onChange(updatedStats);
  };

  const hasSelectedFilters =
    props.stats.numDoors.min > 0 ||
    props.stats.numDoors.max < CryptsMax.NumDoors ||
    props.stats.numPoints.min > 0 ||
    props.stats.numPoints.max < CryptsMax.NumPoints ||
    props.stats.size.min > 0 ||
    props.stats.size.max < CryptsMax.Size;

  return (
    <Popover className="relative z-50">
      <Popover.Button as="div">
        <Button size="xs" variant={hasSelectedFilters ? 'primary' : 'outline'}>
          Rarity
        </Button>
      </Popover.Button>

      <Transition
        enter="transition duration-350 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-350 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute z-10 m-auto mt-2 md:right-0 " static>
          <div className="flex flex-col px-8 py-4 pb-6 font-medium bg-black rounded-sm shadow-sm w-60">
            <div className="mb-3 text-lg text-center uppercase">Stats</div>
            <RangeSliderFilter
              name="Size"
              min={0}
              max={CryptsMax.Size}
              defaultValues={[0, CryptsMax.Size]}
              values={[props.stats.size.min, props.stats.size.max]}
              onChange={onSizeFilterChange}
            />
            <RangeSliderFilter
              name="Doors"
              min={0}
              max={CryptsMax.NumDoors}
              defaultValues={[0, CryptsMax.NumDoors]}
              values={[props.stats.numDoors.min, props.stats.numDoors.max]}
              onChange={onNumDoorsFilterChange}
            />
            <RangeSliderFilter
              name="Points"
              min={0}
              max={CryptsMax.NumPoints}
              defaultValues={[0, CryptsMax.NumPoints]}
              values={[props.stats.numPoints.min, props.stats.numPoints.max]}
              onChange={onNumPointsFilterChange}
            />
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
