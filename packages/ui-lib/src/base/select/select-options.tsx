import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
import { Fragment } from 'react';

export interface SelectOptionsProps extends ComponentProps<'ul'> {
  children: ReactNode;
}

export const SelectOptions = ({
  children,
  className,
  ...props
}: SelectOptionsProps) => {
  return (
    // TODO trnasition conflict with react spring maybe?
    <Transition
      as={Fragment}
      leave="transition ease-in duration-250"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options
        className={clsx(
          'focus:outline-none absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800/90 py-1 text-white shadow-lg border border-white/20',
          className
        )}
        {...props}
      >
        {children}
      </Listbox.Options>
    </Transition>
  );
};
