import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

type TabPanelProps = ComponentProps<'div'>;

export const TabPanel = ({ className, children, ...props }: TabPanelProps) => {
  return (
    <Tab.Panel
      className={clsx(
        'outline-none mt-3 w-full rounded-xl bg-white',
        className
      )}
      {...props}
    >
      {children}
    </Tab.Panel>
  );
};
