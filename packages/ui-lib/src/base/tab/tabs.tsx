import { Tab as HeadlessTab } from '@headlessui/react';
import clsx from 'clsx';
import type { ReactNode, SyntheticEvent } from 'react';
import { Tab } from './tab';
import { TabList } from './tab-list';
import { TabPanel } from './tab-panel';
import { TabPanels } from './tab-panels';
import { TabProvider } from './tab-provider';

export const VARIANTS = {
  default: {
    tab: {
      base: ' relative inline-flex items-center px-2 sm:px-4 pb-2 pt-4 text-xs sm:text-lg md:text-md  transition-all duration-150 hover:shadow border-b-2 border-transparent hover:border-cta-100 font-display',
      active:
        'border-orange-700 shadow-purple-800/10 shadow-md text-orange-700',
      inactive: ' border-transparent text-white/50',
    },
    tabList: 'flex space-x-3 sm:space-x-4  p-2 shadow-inner ',
  },
  primary: {
    tab: {
      base: 'relative flex w-full items-center justify-center px-4 py-2 font-body  uppercase tracking-widest hover:border-cta-100 hover:shadow-md transition-all duration-350  rounded focus-visible:ring-yellow-700  hover:border hover:bg-black border-transparent border',
      active: ' shadow-md bg-black border font-semibold border-cta-100/60',
      inactive: 'bg-transparent text-gray-200',
    },
    tabList: 'flex py-2 space-x-2',
  },
};

export interface TabsProps {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
  selectedIndex?: number;
  onChange?: (index: number | SyntheticEvent) => void;
}

export const Tabs = ({
  children,
  className,
  variant = 'default',
  selectedIndex = 0,
  onChange,
}: TabsProps) => {
  return (
    <TabProvider variant={variant}>
      {onChange ? (
        <HeadlessTab.Group
          as="div"
          className={clsx('flex flex-1 flex-col', className)}
          selectedIndex={selectedIndex}
          onChange={onChange}
        >
          {children}
        </HeadlessTab.Group>
      ) : (
        <HeadlessTab.Group
          as="div"
          className={clsx('flex flex-1 flex-col ', className)}
        >
          {children}
        </HeadlessTab.Group>
      )}
    </TabProvider>
  );
};

Tabs.List = TabList;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;
Tabs.Tab = Tab;
