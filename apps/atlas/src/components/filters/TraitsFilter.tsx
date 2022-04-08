import { Button } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import React, { useRef, useState } from 'react';
import { RealmTraitType } from '@/generated/graphql';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';
import { RangeSliderFilter } from './RangeSliderFilter';

const RegionMax = 7;
const CityMax = 21;
const HarbourMax = 35;
const RiverMax = 60;

type Traits = {
  [RealmTraitType.Region]: number;
  [RealmTraitType.City]: number;
  [RealmTraitType.Harbor]: number;
  [RealmTraitType.River]: number;
};

type TraitsFilterProps = {
  traits: Traits;
  onChange(traits: Traits): void;
};

export function TraitsFilter(props: TraitsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [traits, setTraits] = useState<Traits>(
    props.traits ?? {
      [RealmTraitType.Region]: 0,
      [RealmTraitType.City]: 0,
      [RealmTraitType.Harbor]: 0,
      [RealmTraitType.River]: 0,
    }
  );

  const ref = useRef(null);
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const onRegionFilterChange = (value: number) => {
    const updatedTraits = { ...traits, [RealmTraitType.Region]: value };
    setTraits(updatedTraits);
    props.onChange(updatedTraits);
  };

  const onCityFilterChange = (value: number) => {
    const updatedTraits = { ...traits, [RealmTraitType.City]: value };
    setTraits(updatedTraits);
    props.onChange(updatedTraits);
  };

  const onHarbourFilterChange = (value: number) => {
    const updatedTraits = { ...traits, [RealmTraitType.Harbor]: value };
    setTraits(updatedTraits);
    props.onChange(updatedTraits);
  };

  const onRiverFilterChange = (value: number) => {
    const updatedTraits = { ...traits, [RealmTraitType.River]: value };
    setTraits(updatedTraits);
    props.onChange(updatedTraits);
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
        TRAITS
      </Button>

      {isOpen && (
        <Popover.Panel className="absolute right-0 z-10 mt-2 " ref={ref} static>
          <div className="flex flex-col px-8 py-4 pb-6 font-medium text-white rounded-sm shadow-sm w-60 bg-black">
            <h4 className="text-center">Traits</h4>
            <RangeSliderFilter
              name="Regions"
              min={0}
              max={RegionMax}
              defaultValue={traits[RealmTraitType.Region]}
              onChange={onRegionFilterChange}
            />
            <RangeSliderFilter
              name="Cities"
              min={0}
              max={CityMax}
              defaultValue={traits[RealmTraitType.City]}
              onChange={onCityFilterChange}
            />
            <RangeSliderFilter
              name="Harbours"
              min={0}
              max={HarbourMax}
              defaultValue={traits[RealmTraitType.Harbor]}
              onChange={onHarbourFilterChange}
            />
            <RangeSliderFilter
              name="Rivers"
              min={0}
              max={RiverMax}
              defaultValue={traits[RealmTraitType.River]}
              onChange={onRiverFilterChange}
            />
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
}
