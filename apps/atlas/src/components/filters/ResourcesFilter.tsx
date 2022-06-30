import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';
import { resources } from '@/util/resources';

type ResourcesFilterProps = {
  selectedValues: number[];
  onChange(selected: number[]): void;
};

type ResourceOption = {
  name: string;
  value: number;
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

  const resourcesOptions = resources.map((resource) => ({
    name: resource.trait,
    value: resource.id,
  }));

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
                {resourcesOptions.map((resource, idx) => (
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
                    <span>{resource.name}</span>
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
