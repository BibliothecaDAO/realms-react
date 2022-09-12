import { Switch as HeadlessSwitch } from '@headlessui/react';
import type { ComponentType } from 'react';

type SwitchProps<T> = T extends ComponentType<infer P> ? P : T;

export const Switch = ({
  checked,
  className,
  onChange,
}: SwitchProps<typeof HeadlessSwitch>): JSX.Element => {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      className={
        `${
          checked ? 'bg-green-600/40' : 'bg-blue-600/40'
        } relative inline-flex h-6 w-11 text-xs items-center rounded shadow-inner` +
        className
      }
    >
      <span
        className={`${
          !checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded bg-white transition-all duration-300`}
      />
    </HeadlessSwitch>
  );
};
