import { Button } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';
import type { Environments } from '@/util/cryptsEnvironments';
import { environments } from '@/util/cryptsEnvironments';

type CryptEnvironmentFilterProps = {
  selectedValues?: number[];
  onChange(selected: number[]): void;
};

export function CryptEnvironmentFilter(props: CryptEnvironmentFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const [selected, setSelected] = useState<number[]>(
    props.selectedValues ?? []
  );

  const handleOnClickResourceOption = (option: Environments) => {
    const newValues = selected.filter((value) => value !== option.id);
    if (newValues.length === selected.length) {
      newValues.push(option.id);
    }
    setSelected([...newValues]);
    props.onChange([...newValues]);
  };

  const isSelected = (option: Environments) => selected.indexOf(option.id) > -1;

  return (
    <Popover className="relative">
      <Button
        variant="primary"
        className="px-4 ml-2 uppercase"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Environments
      </Button>

      {isOpen && (
        <Popover.Panel
          className="absolute z-10 mt-2 w-[300px] ml-2 left-1/2 -translate-x-1/2"
          ref={ref}
          static
        >
          <div className="flex flex-col items-center gap-4 p-4 pb-8 font-medium text-white rounded-sm shadow-lg bg-[#74787A]">
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
                  <span>{env.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
}
