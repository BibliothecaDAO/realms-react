import type { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TooltipProps {
  children: ReactElement;
  tooltipText: string;
  className?: string;
}

export const Tooltip = ({ children, tooltipText, className }: TooltipProps) => {
  return (
    <div
      className={twMerge(
        className,
        ' relative flex flex-col items-center justify-center group'
      )}
    >
      {children}
      <div className="absolute top-0 -translate-y-full w-max flex flex-col items-center hidden group-hover:flex">
        <span className="relative rounded z-100 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">
          {tooltipText}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
      </div>
    </div>
  );
};

Tooltip.displayName = 'Tooltip';
