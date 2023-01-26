import { Tab as HeadlessTab } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { Fragment, useContext } from 'react';
import ActiveTabLeft from '../../icons/frame/activeTab_left.svg';
import ActiveTabRight from '../../icons/frame/activeTab_right.svg';
import { TabContext } from './tab-provider';
import { VARIANTS } from './tabs';

type TabProps = ComponentProps<'button'>;

export const Tab = ({ className, children, ...props }: TabProps) => {
  const { variant } = useContext(TabContext)!;

  const isPrimary = variant === 'primary';

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
      {(props) => {
        return (
          <>
            {isPrimary && (
              <>
                {props.selected ? (
                  <>
                    <ActiveTabLeft className="absolute top-0 left-0 h-full fill-frame-secondary" />
                    <ActiveTabRight className="absolute -top-[1px] right-0 h-full fill-frame-secondary" />

                    <div className="absolute top-[4.5px] right-0 w-1/2 h-[1px] bg-yellow-secondary -translate-x-1/2" />
                    <div className="absolute top-[3px] right-0  w-1/2 h-[1px] bg-yellow-secondary -translate-x-1/2" />
                    <div
                      className="absolute bottom-[8px] right-0 w-1/2 h-[1px] bg-yellow-secondary"
                      style={{ transform: 'translateX(-44%)' }}
                    />
                    <div className="flex items-center justify-center ml-2">
                      {children}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute bottom-[9px] right-0 w-full h-[1px] bg-yellow-secondary" />
                    <div className="absolute bottom-[7px] right-0 w-full h-[1px] bg-yellow-secondary" />
                    {children}
                  </>
                )}
              </>
            )}
            {!isPrimary && <>{children}</>}
          </>
        );
      }}
    </HeadlessTab>
  );
};
