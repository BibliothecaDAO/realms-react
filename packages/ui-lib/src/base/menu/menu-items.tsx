import { Menu as HeadlessMenu } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type MenuItemsProps = ComponentProps<'div'>;

export const MenuItems = forwardRef<HTMLDivElement, MenuItemsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <HeadlessMenu.Items
        className={twMerge(
          clsx(
            'focus:outline-none mt-2 w-56 divide-y-2 divide-gray-100 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5',
            className
          )
        )}
        ref={ref}
        {...props}
      >
        {children}
      </HeadlessMenu.Items>
    );
  }
);

MenuItems.displayName = 'MenuItems';
