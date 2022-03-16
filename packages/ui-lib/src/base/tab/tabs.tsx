import { Tab as HeadlessTab } from '@headlessui/react';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Tab } from './tab';
import { TabList } from './tab-list';
import { TabPanel } from './tab-panel';
import { TabPanels } from './tab-panels';
import { TabProvider } from './tab-provider';

export const VARIANTS = {
  default: {
    tab: {
      base: 'border-b-4 relative inline-flex items-center justify-center px-3 py-2 text text-white text-shadow-md',
      active:
        'border-white focus:outline-none focus:ring-2 font-bold ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
      inactive: 'border-transparent hover:text-gray-300',
    },
    tabList: 'flex space-x-10',
  },
  primary: {
    tab: {
      base: 'relative flex w-full items-center justify-center px-8 py-2',
      active: 'bg-white rounded-lg shadow-md text-gray-900 font-semibold',
      inactive: 'bg-transparent text-gray-400',
    },
    tabList: 'flex p-1 space-x-6 bg-gray-100 rounded-lg',
  },
};

export interface TabsProps {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}

export const Tabs = ({
  children,
  className,
  variant = 'default',
}: TabsProps) => {
  return (
    <div className="p-8 bg-black/30">
      <TabProvider variant={variant}>
        <HeadlessTab.Group
          as="div"
          className={clsx('flex flex-1 flex-col', className)}
        >
          {children}
        </HeadlessTab.Group>
      </TabProvider>
    </div>
  );
};

Tabs.List = TabList;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;
Tabs.Tab = Tab;
