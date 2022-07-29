import type { FC, ReactNode } from 'react';
import { Head } from '@/components/Head';

export const MainLayout: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Head />
      <main>{children}</main>
    </div>
  );
};
