import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
export const BaseFilter = ({ children }: Props) => {
  return (
    <div className="flex flex-wrap justify-between py-2 sm:px-2 z-50">
      <div className="flex flex-wrap self-center w-full gap-2 px-2">
        {children}
      </div>
    </div>
  );
};
