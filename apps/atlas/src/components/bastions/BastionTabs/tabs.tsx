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
      base: 'relative inline-flex items-center px-2 sm:px-4 pb-2 pt-4 text-xs sm:text-lg md:text-md transition-all duration-150 hover:text-shadow-[0_2px_10px_#f97316]',
      active: ' text-orange-700 text-shadow-[0_2px_10px_#f97316]',
      inactive: ' border-transparent text-white/50',
    },
    tabList: 'flex space-x-3 sm:space-x-4  p-2 shadow-inner ',
  },
  primary: {
    tab: {
      base: 'relative flex w-full items-center justify-center px-4 pb-1 h-12 tracking-widest hover:border-cta-100 hover:shadow-md transition-all duration-350 rounded uppercase ',
      active: '',
      inactive: 'bg-transparent',
    },
    tabList: 'flex py-2',
  },
  small: {
    tab: {
      base: 'relative flex w-full items-center justify-center px-2 py-2 tracking-widest hover:border-yellow-700 transition-all duration-450 rounded focus-visible:ring-yellow-700 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-900 hover:text-yellow-100 hover:bg-cta-100 hover:bg-red-700 shadow-lg border-b-2 border-l  text-yellow-100 border-transparent paper',
      active:
        'bg-gradient-to-r from-red-600 to-red-900 text-yellow-100 border-yellow-700',
      inactive: 'bg-transparent text-gray-200',
    },
    tabList: 'flex p-1 space-x-2 border rounded-lg border-yellow-800/40',
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
          className={clsx('flex  flex-col ', className)}
          selectedIndex={selectedIndex}
          onChange={onChange}
        >
          {children}
        </HeadlessTab.Group>
      ) : (
        <HeadlessTab.Group
          as="div"
          className={clsx('flex flex-col ', className)}
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
