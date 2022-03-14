import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

type TabPanelsProps = ComponentProps<'article'>;

export const TabPanels = ({
  className,
  children,
  ...props
}: TabPanelsProps) => {
  return (
    <Tab.Panels
      as="article"
      className={clsx('mt-2 flex', className)}
      {...props}
    >
      {children}
    </Tab.Panels>
  );
};
