import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';
import { resources } from '@/constants/resources';

type ResourcesFilterProps = {
  selectedValues: number[];
  onChange(selected: number[]): void;
};

type ResourceOption = {
  name: string;
  value: number;
};

export function ResourcesFilter(props: ResourcesFilterProps) {
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

  const resourcesOptions = resources.map((resource) => ({
    name: resource.trait,
    value: resource.id,
  }));

  return (
    <Popover className="relative z-100">
      <Popover.Button as="div">
        <Button
          size="xs"
          variant={props.selectedValues.length > 0 ? 'primary' : 'outline'}
        >
          Resources
        </Button>
      </Popover.Button>
      <Transition
        enter="transition duration-350 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-350 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        className="z-100"
      >
        <Popover.Panel
          className="absolute  mt-2 w-[420px] ml-2 -translate-x-1/3 shadow-black border-4  border-white/20"
          static
        >
          {({ close }) => (
            <div className="flex flex-col items-center gap-4 p-4 pb-8 rounded shadow-lg bg-gray-1000">
              <div className="flex justify-between w-full">
                <h4 className="text-center">Select Resources</h4>
                <button onClick={() => close()}>close</button>
              </div>

              <div className="relative grid items-center justify-center grid-cols-2 gap-4">
                {resourcesOptions.map((resource, idx) => (
                  <div
                    role="button"
                    key={resource.value}
                    tabIndex={idx}
                    className={clsx(
                      'flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-200/20 duration-150 transition-all  rounded font-semibold',
                      isSelected(resource) ? 'bg-gray-200/20' : ''
                    )}
                    onClick={() => {
                      handleOnClickResourceOption(resource);
                    }}
                    aria-hidden="true"
                  >
                    <div>
                      <ResourceIcon
                        resource={resource.name.replace(' ', '')}
                        size="xs"
                      />{' '}
                    </div>

                    <span>{resource.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
