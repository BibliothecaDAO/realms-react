import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';
import type { Environment } from '@/util/cryptsEnvironments';
import { environments } from '@/util/cryptsEnvironments';

type CryptEnvironmentFilterProps = {
  selectedValues: number[];
  onChange(selected: number[]): void;
};

export function CryptEnvironmentFilter(props: CryptEnvironmentFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const handleOnClickResourceOption = (option: Environment) => {
    const newValues = props.selectedValues.filter(
      (value) => value !== option.id
    );
    if (newValues.length === props.selectedValues.length) {
      newValues.push(option.id);
    }
    props.onChange([...newValues]);
  };

  const isSelected = (option: Environment) =>
    props.selectedValues.indexOf(option.id) > -1;

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
          Environments
        </Button>

        {isOpen && (
          <Popover.Panel
            className="absolute z-10 mt-2 w-[300px] ml-2 left-1/2 -translate-x-1/2  rounded"
            static
          >
            <div className="flex flex-col items-center gap-4 p-4 pb-8 font-medium  bg-black rounded-sm shadow-lg">
              <div className="text-lg text-center uppercase">Environments</div>

              <div className="relative grid items-center justify-center grid-cols-2 gap-4">
                {environments.map((env, idx) => (
                  <div
                    role="button"
                    key={env.id}
                    tabIndex={idx}
                    className={clsx(
                      'flex items-center gap-2 uppercase rounded-sm cursor-pointer px-2 py-1',
                      isSelected(env) ? 'bg-[#515151]' : ''
                    )}
                    onClick={() => handleOnClickResourceOption(env)}
                    aria-hidden="true"
                  >
                    <ResourceIcon
                      resource={env.name.replace(' ', '').replace("'", '')}
                      size="md"
                    />{' '}
                    <span>{env.name}</span>
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
