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
      base: ' relative inline-flex items-center px-2 sm:px-4 py-1 text-xs sm:text-lg md:text-md font-body uppercase tracking-widest transition-all duration-150  rounded border hover:border-cta-100 hover:shadow text-gray-700',
      active:
        ' focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-100 ring-cta-100 ring-opacity-90 text-white border-cta-100 border',
      inactive: 'text-white border-transparent',
    },
    tabList: 'flex space-x-3 sm:space-x-4 bg-black/90 p-2 shadow-inner ',
  },
  primary: {
    tab: {
      base: 'relative flex w-full items-center justify-center px-4 py-1 font-body  uppercase tracking-widest hover:border-cta-100 hover:shadow-md transition-all duration-150 hover:text-white rounded    focus-visible:ring-yellow-700 border-cta-100 hover:border',
      active: ' shadow-md text-white border',
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
          className={clsx(
            'flex flex-1 flex-col border-t border-b border-black',
            className
          )}
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
