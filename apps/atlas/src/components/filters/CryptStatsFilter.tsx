import { Button } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import React, { useRef, useState } from 'react';
import { RealmTraitType } from '@/generated/graphql';
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
  const [stats, setStats] = useState<Stats>(
    props.stats ?? {
      size: 0,
      numDoors: 0,
      numPoints: 0,
    }
  );

  const ref = useRef(null);
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const onSizeFilterChange = (value: number) => {
    const updatedStats = { ...stats, size: value };
    setStats(updatedStats);
    props.onChange(updatedStats);
  };

  const onNumDoorsFilterChange = (value: number) => {
    const updatedStats = { ...stats, numDoors: value };
    setStats(updatedStats);
    props.onChange(updatedStats);
  };

  const onNumPointsFilterChange = (value: number) => {
    const updatedStats = { ...stats, numPoints: value };
    setStats(updatedStats);
    props.onChange(updatedStats);
  };

  return (
    <Popover className="relative">
      <Button
        variant="primary"
        className="px-4 ml-2 uppercase"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        STATS
      </Button>

      {isOpen && (
        <Popover.Panel className="absolute right-0 z-10 mt-2 " ref={ref} static>
          <div className="flex flex-col px-8 py-4 pb-6 font-medium text-white rounded-sm shadow-sm w-60 bg-black">
            <div className="mb-3 text-lg text-center uppercase">Stats</div>
            <RangeSliderFilter
              name="Size"
              min={0}
              max={SizeMax}
              defaultValue={stats.size}
              onChange={onSizeFilterChange}
            />
            <RangeSliderFilter
              name="Num Doors"
              min={0}
              max={NumDoorsMax}
              defaultValue={stats.numDoors}
              onChange={onNumDoorsFilterChange}
            />
            <RangeSliderFilter
              name="Num Points"
              min={0}
              max={NumPointsMax}
              defaultValue={stats.numPoints}
              onChange={onNumPointsFilterChange}
            />
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
}
