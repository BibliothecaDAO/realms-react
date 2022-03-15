import type { ReactElement } from 'react';
import { forwardRef } from 'react';
import type { ButtonOrLinkProps } from '../button/Button';
import { Button } from '../button/Button';

export interface IconButtonProps
  extends Omit<
    ButtonOrLinkProps,
    | 'fullWidth'
    | 'leftIcon'
    | 'rightIcon'
    | 'loading'
    | 'loadingText'
    | 'spinner'
    | 'isIconButton'
  > {
  icon: ReactElement;
  'aria-label': string;
}

export const IconButton = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  IconButtonProps
>(({ icon, 'aria-label': ariaLabel, ...props }, ref) => {
  return (
    <Button ref={ref} aria-label={ariaLabel} isIconButton {...props}>
      {icon}
    </Button>
  );
});

IconButton.displayName = 'IconButton';
