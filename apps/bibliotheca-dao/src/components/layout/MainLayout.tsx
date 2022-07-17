import type { FC, ReactNode } from 'react';
import { MainFooter } from '@/components/layout/MainFooter';
import { MainHeader } from './MainHeader';

export const MainLayout: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <MainHeader />
      <main>{children}</main>
      <MainFooter />
    </div>
  );
};
