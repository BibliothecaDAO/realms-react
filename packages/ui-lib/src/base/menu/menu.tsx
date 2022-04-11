import { Menu as HeadlessMenu } from '@headlessui/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { MenuButton } from './menu-button';
import { MenuGroup } from './menu-group';
import { MenuItem } from './menu-item';
import { MenuItems } from './menu-items';

export type MenuProps = ComponentProps<'div'>;

export const Menu = ({ className, children, ...props }: MenuProps) => {
  return (
    <HeadlessMenu
      as="div"
      className={clsx('relative inline-block w-full text-left', className)}
      {...props}
    >
      {children}
    </HeadlessMenu>
  );
};

Menu.Items = MenuItems;
Menu.Item = MenuItem;
Menu.Group = MenuGroup;
Menu.Button = MenuButton;
