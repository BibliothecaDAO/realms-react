import type { ReactElement } from 'react';
import { forwardRef } from 'react';
import type { LinkProps } from '../button';
import { Link } from '../button';

export interface IconLinkProps
  extends Omit<
    LinkProps,
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

export const IconLink = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  IconLinkProps
>(({ href, icon, 'aria-label': ariaLabel, ...props }, ref) => {
  return (
    <Link ref={ref} aria-label={ariaLabel} href={href} isIconButton {...props}>
      {icon}
    </Link>
  );
});

IconLink.displayName = 'Icon Link';
