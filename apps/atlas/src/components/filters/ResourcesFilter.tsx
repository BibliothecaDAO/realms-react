import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { ResourceType } from '@/generated/graphql';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';

type ResourcesFilterProps = {
  selectedValues: ResourceType[];
  onChange(selected: ResourceType[]): void;
};

type ResourceOption = {
  name: string;
  value: ResourceType;
};

export function ResourcesFilter(props: ResourcesFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const handleOnClickResourceOption = (option: ResourceOption) => {
    const newValues = props.selectedValues.filter(
      (value) => value !== option.value
    );
    if (newValues.length === props.selectedValues.length) {
      newValues.push(option.value);
    }
    props.onChange([...newValues]);
  };

  const isSelected = (option: ResourceOption) =>
    props.selectedValues.indexOf(option.value) > -1;

  const resources = [
    { name: 'Adamantine', value: ResourceType.Adamantine },
    { name: 'Alchemical Silver', value: ResourceType.AlchemicalSilver },
    { name: 'Coal', value: ResourceType.Coal },
    { name: 'Cold Iron', value: ResourceType.ColdIron },
    { name: 'Copper', value: ResourceType.Copper },
    { name: 'Deep Crystal', value: ResourceType.DeepCrystal },
    { name: 'Diamonds', value: ResourceType.Diamonds },
    { name: 'Dragonhide', value: ResourceType.Dragonhide },
    { name: 'Ethereal Silica', value: ResourceType.EtherealSilica },
    { name: 'Gold', value: ResourceType.Gold },
    { name: 'Hartwood', value: ResourceType.Hartwood },
    { name: 'Ignium', value: ResourceType.Ignium },
    { name: 'Ironwood', value: ResourceType.Ironwood },
    { name: 'Mithral', value: ResourceType.Mithral },
    { name: 'Obsidian', value: ResourceType.Obsidian },
    { name: 'Ruby', value: ResourceType.Ruby },
    { name: 'Sapphire', value: ResourceType.Sapphire },
    { name: 'Silver', value: ResourceType.Silver },
    { name: 'Stone', value: ResourceType.Stone },
    { name: 'True Ice', value: ResourceType.TrueIce },
    { name: 'Twilight Quartz', value: ResourceType.TwilightQuartz },
    { name: 'Wood', value: ResourceType.Wood },
  ];

  return (
    <Popover className="relative">
      <div ref={ref}>
        <Button
          variant="primary"
          size="sm"
          className={clsx(props.selectedValues.length > 0 ? 'bg-black' : '')}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Resources
        </Button>

        {isOpen && (
          <Popover.Panel
            className="absolute z-10 mt-2 w-[420px] ml-2 -translate-x-1/3"
            static
          >
            <div className="flex flex-col items-center gap-4 p-4 pb-8 text-white bg-black rounded shadow-lg">
              <h4 className="text-center">Resources</h4>

              <div className="relative grid items-center justify-center grid-cols-2 gap-4">
                {resources.map((resource, idx) => (
                  <div
                    role="button"
                    key={resource.value}
                    tabIndex={idx}
                    className={clsx(
                      'flex items-center gap-2 uppercase rounded-sm cursor-pointer px-2 py-1 hover:bg-gray-200/20 duration-150 transition-all tracking-normal md:tracking-wide',
                      isSelected(resource) ? 'bg-gray-200/20' : ''
                    )}
                    onClick={() => handleOnClickResourceOption(resource)}
                    aria-hidden="true"
                  >
                    <ResourceIcon
                      resource={resource.name.replace(' ', '')}
                      size="xs"
                    />{' '}
                    <span>{resource.value.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </Popover.Panel>
        )}
      </div>
    </Popover>
  );
}
