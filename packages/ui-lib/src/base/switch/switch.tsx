import { Switch as HeadlessSwitch } from '@headlessui/react';
import type { ComponentType, PropsWithChildren } from 'react';

type SwitchProps<T> = T extends ComponentType<infer P>
  ? P & PropsWithChildren
  : T;

export const Switch = ({
  checked,
  className,
  onChange,
  children,
}: SwitchProps<typeof HeadlessSwitch>): JSX.Element => {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      className={
        `${
          checked ? 'bg-green-600/40' : 'bg-blue-600/40'
        } h-6 text-xs rounded shadow-inner transition-all duration-300 justify-items-start` +
        className
      }
    >
      {children ? (
        <div className="w-full flex relative">{children}</div>
      ) : (
        <span
          className={`${
            !checked ? 'translate-x-full' : 'translate-x-0'
          } block h-4 w-1/2 transform rounded bg-white l-0 transition-all duration-300 `}
        />
      )}
    </HeadlessSwitch>
  );
};
