import { Menu as HeadlessMenu } from '@headlessui/react';
import { forwardRef } from 'react';
import type { ButtonOrLinkProps } from '../button';
import { Button } from '../button';

export const MenuButton = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonOrLinkProps
>(({ ...props }, ref) => {
  return <HeadlessMenu.Button as={Button} ref={ref} {...props} />;
});

MenuButton.displayName = 'MenuButton';
