import { forwardRef } from 'react';
import type { ButtonOrLinkProps } from './ButtonOrLink';
import { ButtonOrLink } from './ButtonOrLink';

export const Button = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonOrLinkProps
>(({ type = 'button', ...props }, ref) => {
  return <ButtonOrLink ref={ref} type={type} {...props} />;
});
Button.displayName = 'Button';
