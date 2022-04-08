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
      base: ' relative inline-flex items-center px-4 py-1 text-md font-body uppercase tracking-widest transition-all duration-150 font-semibold rounded hover:bg-white/80 hover:text-gray-600 hover:shadow',
      active:
        ' focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-100 ring-white ring-opacity-20 text-gray-600 bg-white/80 shadow',
      inactive: 'text-white border-transparent',
    },
    tabList: 'flex space-x-8 sm:space-x-2 bg-white/50 p-2 rounded my-4  ',
  },
  primary: {
    tab: {
      base: 'relative flex w-full items-center justify-center px-4 py-2 font-body font-bold uppercase tracking-widest hover:bg-gray-600 hover:shadow-md transition-all duration-150 hover:text-white rounded',
      active: 'bg-gray-600  shadow-md text-white',
      inactive: 'bg-transparent text-gray-200',
    },
    tabList: 'flex py-3 space-x-2',
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
      <HeadlessTab.Group
        as="div"
        className={clsx('flex flex-1 flex-col ', className)}
        selectedIndex={selectedIndex}
        onChange={onChange}
      >
        {children}
      </HeadlessTab.Group>
    </TabProvider>
  );
};

Tabs.List = TabList;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;
Tabs.Tab = Tab;
