import { Button } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import React, { useRef, useState } from 'react';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';
import { RangeSliderFilter } from './RangeSliderFilter';

const RegionMax = 7;
const CityMax = 21;
const HarbourMax = 35;
const RiverMax = 60;

type Traits = {
  region: number;
  city: number;
  harbour: number;
  river: number;
};

type TraitsFilterProps = {
  traits: Traits;
  onChange(traits: Traits): void;
};

export function TraitsFilter(props: TraitsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [traits, setTraits] = useState<Traits>(
    props.traits ?? { region: 0, city: 0, harbour: 0, river: 0 }
  );

  const ref = useRef();
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const onRegionFilterChange = (value: number) => {
    const updatedTraits = { ...traits, region: value };
    setTraits(updatedTraits);
    props.onChange(updatedTraits);
  };

  const onCityFilterChange = (value: number) => {
    const updatedTraits = { ...traits, city: value };
    setTraits(updatedTraits);
    props.onChange(updatedTraits);
  };

  const onHarbourFilterChange = (value: number) => {
    const updatedTraits = { ...traits, harbour: value };
    setTraits(updatedTraits);
    props.onChange(updatedTraits);
  };

  const onRiverFilterChange = (value: number) => {
    const updatedTraits = { ...traits, river: value };
    setTraits(updatedTraits);
    props.onChange(updatedTraits);
  };

  return (
    <Popover className="relative">
      <Popover.Button>
        <Button
          variant="primary"
          className="px-4 ml-2 uppercase"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          TRAITS
        </Button>
      </Popover.Button>

      {isOpen && (
        <Popover.Panel className="absolute right-0 z-10 mt-2 " ref={ref} static>
          <div
            className="flex flex-col px-8 py-4 pb-6 font-medium text-white rounded-sm shadow-sm w-60"
            style={{ backgroundColor: '#74787A' }}
          >
            <div className="mb-3 text-lg text-center uppercase">Traits</div>
            <RangeSliderFilter
              name="Regions"
              min={0}
              max={RegionMax}
              defaultValue={traits.region}
              onChange={onRegionFilterChange}
            />
            <RangeSliderFilter
              name="Cities"
              min={0}
              max={CityMax}
              defaultValue={traits.city}
              onChange={onCityFilterChange}
            />
            <RangeSliderFilter
              name="Harbours"
              min={0}
              max={HarbourMax}
              defaultValue={traits.harbour}
              onChange={onHarbourFilterChange}
            />
            <RangeSliderFilter
              name="Rivers"
              min={0}
              max={RiverMax}
              defaultValue={traits.river}
              onChange={onRiverFilterChange}
            />
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
}
