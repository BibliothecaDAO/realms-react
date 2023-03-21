import { Tab as HeadlessTab } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { Fragment, useContext } from 'react';
import ActiveTabLeft from './icons/activeTab_left.svg';
import ActiveTabRight from './icons/activeTab_right.svg';
import { TabContext } from './tab-provider';
import { VARIANTS } from './tabs';

type TabProps = ComponentProps<'button'> & { noText?: boolean };

export const Tab = ({
  className,
  children,
  noText,
  color,
  ...props
}: TabProps) => {
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
                    <ActiveTabLeft className="absolute top-0 left-0 h-full fill-current" />
                    <ActiveTabRight className="absolute -top-[1px] right-0 h-full fill-current" />

                    {!noText && (
                      <>
                        <div className="absolute top-[4.5px] right-0 w-1/2 h-[1px] bg-current -translate-x-1/2" />
                        <div className="absolute top-[3px] right-0  w-1/2 h-[1px] bg-current -translate-x-1/2" />
                      </>
                    )}
                    <div
                      className="absolute bottom-[8px] right-0 w-1/2 h-[1px] bg-current"
                      style={{ transform: 'translateX(-44%)' }}
                    />
                    <div className="flex items-center justify-center ml-2">
                      {children}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute bottom-[9px] right-0 w-full h-[1px] bg-current" />
                    <div className="absolute bottom-[7px] right-0 w-full h-[1px] bg-current" />
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
