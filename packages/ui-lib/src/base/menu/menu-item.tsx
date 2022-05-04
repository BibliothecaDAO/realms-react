import { Menu as HeadlessMenu } from '@headlessui/react';
import type { ReactElement } from 'react';

interface MenuItemRenderProps {
  active: boolean;
  disabled: boolean;
}

export interface MenuItemProps {
  children({ active, disabled }: MenuItemRenderProps): ReactElement;
}

export const MenuItem = ({ children }: MenuItemProps) => {
  return (
    <HeadlessMenu.Item>
      {({ active, disabled }) => children({ active, disabled })}
    </HeadlessMenu.Item>
  );
};
