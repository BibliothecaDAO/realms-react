/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import { Listbox } from '@headlessui/react';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { SelectButton } from './select-button';
import { SelectOption } from './select-option';
import { SelectOptions } from './select-options';

export interface SelectProps<T extends unknown = string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  children: ReactNode;
  className?: string;
  optionIcons?: boolean;
}

export const Select = <T extends unknown = string>({
  label,
  value,
  onChange,
  children,
  className,
  optionIcons,
  ...props
}: SelectProps<T>) => {
  return (
    <Listbox
      as="div"
      className={clsx('relative space-y-1', className)}
      value={value}
      onChange={onChange}
      {...props}
    >
      {label && (
        <Listbox.Label className="text-sm font-semibold text-gray-500 uppercase">
          {label}
        </Listbox.Label>
      )}
      {children}
    </Listbox>
  );
};

Select.Button = SelectButton;
Select.Options = SelectOptions;
Select.Option = SelectOption;
