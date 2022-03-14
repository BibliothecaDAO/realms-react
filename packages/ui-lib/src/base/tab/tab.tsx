import { Tab as HeadlessTab } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { useContext } from 'react';
import { TabContext } from './tab-provider';
import { VARIANTS } from './tabs';

type TabProps = ComponentProps<'button'>;

export const Tab = ({ className, children, ...props }: TabProps) => {
  const { variant } = useContext(TabContext)!;

  return (
    <HeadlessTab
      className={({ selected }) =>
        clsx(
          VARIANTS[variant].tab.base,
          selected
            ? VARIANTS[variant].tab.active
            : VARIANTS[variant].tab.inactive,
          className
        )
      }
      {...props}
    >
      {children}
    </HeadlessTab>
  );
};
