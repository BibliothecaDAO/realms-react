import { Listbox } from '@headlessui/react';
import clsx from 'clsx';
import type { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

const labelVariants = {
  default: 'text-black font-semibold',
  placeholder: 'text-gray-400 font-medium',
};

interface Props {
  label: string;
  className?: string;
  variant?: keyof typeof labelVariants;
  icon?: ReactElement;
}

export const SelectButton = ({
  label,
  className,
  variant = 'default',
  icon,
}: Props) => {
  const labelVariant = labelVariants[variant];

  return (
    <Listbox.Button
      className={twMerge(
        clsx(
          'relative w-full cursor-default rounded bg-white py-1 pl-2 pr-10 text-left text-sm ring-2 ring-black ring-opacity-5 transition duration-150 ease-in-out',
          'focus:outline-none hover:ring-opacity-100 focus-visible:ring-opacity-100',
          className
        )
      )}
    >
      <span className={clsx('block truncate', labelVariant)}>{label}</span>
      {icon && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
          {icon}
        </span>
      )}
    </Listbox.Button>
  );
};
SelectButton.displayName = 'SelectButton';
