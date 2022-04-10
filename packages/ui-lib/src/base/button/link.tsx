import { forwardRef } from 'react';
import type { ButtonOrLinkProps } from './ButtonOrLink';
import { ButtonOrLink } from './ButtonOrLink';

export interface LinkProps extends Omit<ButtonOrLinkProps, 'href'> {
  href: string;
}

export const Link = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  LinkProps
>(({ href, ...props }, ref) => {
  return <ButtonOrLink ref={ref} href={href} {...props} />;
});
Link.displayName = 'Link';
