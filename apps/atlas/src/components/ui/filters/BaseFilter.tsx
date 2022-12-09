import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
export const BaseFilter = ({ children }: Props) => {
  return (
    <div className="z-50 flex flex-wrap justify-between py-2 mb-4">
      <div className="flex flex-wrap self-center w-full gap-2">{children}</div>
    </div>
  );
};
