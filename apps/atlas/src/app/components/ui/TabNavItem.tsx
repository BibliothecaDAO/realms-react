import clsx from 'clsx';
import Link from 'next/link';

export const TabNavItem = ({
  children,
  href,
  isActive,
}: {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={clsx(
        'relative inline-flex items-center px-2 sm:px-4 pb-2 pt-4 text-xs sm:text-lg md:text-md  transition-all duration-150 font-display  uppercase hover:text-shadow-[0_2px_10px_#f97316]',
        {
          'border-transparent text-white/50': !isActive,
          'text-orange-700 text-shadow-[0_2px_10px_#f97316]': isActive,
        }
      )}
    >
      {children}
    </Link>
  );
};
