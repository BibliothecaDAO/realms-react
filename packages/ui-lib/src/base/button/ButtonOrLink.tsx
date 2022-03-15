import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ComponentPropsWithRef, ReactElement } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Spinner } from '../spinner';

const STYLES = {
  base: 'relative inline-flex items-center justify-center tracking-wide outline-none select-none font-semibold text-left outline-none rounded-lg transition duration-150 ease-in-out',
  active:
    'focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  disabled: 'disabled:opacity-60 disabled:pointer-events-none',
  size: {
    base: {
      xs: 'py-1 px-2 text-xs',
      sm: 'py-2 px-3 text-sm',
      md: 'py-2 px-3 text-md',
      lg: 'py-2 px-4 text-lg',
    },
    icon: {
      xs: 'p-1 text-xs',
      sm: 'p-2 text-sm',
      md: 'p-3 text-md',
      lg: 'p-4 text-lg',
    },
  },
  variant: {
    default:
      'text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 active:text-gray-900 hover:text-gray-900',
    primary:
      'font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-700',
    secondary:
      'text-gray-700 bg-transparent border-2 border-gray-200 hover:bg-gray-100 active:text-gray-900 hover:text-gray-900 active:bg-gray-200',
    tertiary:
      'text-gray-500 bg-white hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 active:text-gray-900',
    danger:
      'text-red-600 focus-visible:bg-red-100 focus-visible:ring-red-600 active:bg-red-200 hover:bg-red-100',
    link: '!p-0 font-semibold text-green-600 focus-visible:ring-transparent focus:underline hover:underline',
    unstyled: '',
  },
} as const;

export const getButtonStyles = () => STYLES;

export interface Styles {
  size?: keyof typeof STYLES['size']['base'];
  variant?: keyof typeof STYLES['variant'];
  fullWidth?: boolean;
}

export type ButtonOrLinkProps = {
  preserveRedirect?: boolean;
  replace?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  isIconButton?: boolean;
  loading?: boolean;
  loadingText?: string;
  spinner?: ReactElement;
} & ComponentPropsWithRef<'button'> &
  ComponentPropsWithRef<'a'> &
  Styles;

export const ButtonOrLink = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonOrLinkProps
>(
  (
    {
      href,
      replace = false,
      preserveRedirect = false,
      size = 'md',
      variant = 'default',
      isIconButton = false,
      fullWidth = false,
      loading = false,
      loadingText,
      spinner = <Spinner variant="circle" size="sm" />,
      className,
      children,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const router = useRouter();
    const isLink = typeof href !== 'undefined';
    const ButtonOrLink = isLink ? 'a' : 'button';

    const classes =
      variant === 'unstyled'
        ? className
        : clsx(
            STYLES.base,
            STYLES.disabled,
            STYLES.active,
            STYLES.variant[variant],
            isIconButton ? STYLES.size.icon[size] : STYLES.size.base[size],
            fullWidth && 'w-full'
          );

    const content = (
      <ButtonOrLink
        ref={ref}
        className={twMerge(classes, className)}
        disabled={disabled || loading}
        {...props}
      >
        {(leftIcon || loading) && (
          <span className="mr-3.5">{loading ? spinner : leftIcon}</span>
        )}
        {loading ? loadingText || children : children}
        {rightIcon && <span className="ml-3.5">{rightIcon}</span>}
      </ButtonOrLink>
    );

    if (isLink) {
      const finalHref =
        preserveRedirect && router.query.redirect
          ? `${href!}?redirect=${encodeURIComponent(
              router.query.redirect as string
            )}`
          : href!;

      return (
        <Link href={finalHref} passHref replace>
          {content}
        </Link>
      );
    }

    return content;
  }
);

ButtonOrLink.displayName = 'ButtonOrLink';
