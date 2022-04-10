import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type MenuGroupProps = ComponentProps<'div'>;

export const MenuGroup = ({
  className,
  children,
  ...props
}: MenuGroupProps) => {
  return (
    <div className={twMerge(clsx('w-full px-1 py-1', className))} {...props}>
      {children}
    </div>
  );
};
