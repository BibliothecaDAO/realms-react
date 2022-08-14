import type { FC, ReactNode } from 'react';
import { Head } from '@/components/Head';

export const MainLayout: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  return (
    <div className="bg-gray-900">
      <Head />
      <main className="">{children}</main>
    </div>
  );
};
