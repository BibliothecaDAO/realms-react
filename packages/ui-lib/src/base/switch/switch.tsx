import { Switch as HeadlessSwitch } from '@headlessui/react';
import type { ReactNode } from 'react';

export interface SwitchProps {
  children?: ReactNode;
  checked: boolean;
  className?: string;
  onChange(checked: boolean): void;
}

export const Switch = ({ checked, children, onChange }: SwitchProps) => {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={() => onChange(!checked)}
      className={`${
        checked ? 'bg-green-600/40' : 'bg-blue-600/40'
      } relative inline-flex h-6 w-11 text-xs items-center rounded shadow-inner`}
    >
      <span
        className={`${
          !checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded bg-white transition-all duration-300`}
      />
    </HeadlessSwitch>
  );
};
