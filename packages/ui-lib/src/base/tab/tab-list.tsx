import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { useContext } from 'react';
import { TabContext } from './tab-provider';
import { VARIANTS } from './tabs';

type TabListProps = ComponentProps<'div'>;

export const TabList = ({ className, children, ...props }: TabListProps) => {
  const { variant } = useContext(TabContext)!;

  return (
    <Tab.List className={clsx(VARIANTS[variant].tabList, className)} {...props}>
      {children}
    </Tab.List>
  );
};
