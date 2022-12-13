import type { FC, ReactNode } from 'react';
import { MainFooter } from '@/components/layout/MainFooter';
import Tourus from '@/components/Tourus';
import { MainHeader } from './MainHeader';
export const MainLayout: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="fixed w-screen h-screen bg-gray-900">
        <Tourus />
      </div>
      <MainHeader />
      <main className="relative z-20">{children}</main>
      <MainFooter />
    </div>
  );
};
