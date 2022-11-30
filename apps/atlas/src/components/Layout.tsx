import type { ReactElement } from 'react';
import React from 'react';
import { BottomLeftNav } from '@/components/navigation/BottomLeftNav';
// import { Header } from '@/components/navigation/Header';
import { MenuSideBar } from '@/components/navigation/MenuSideBar';
import { TopLeftNav } from '@/components/navigation/TopLeftNav';
import { TopRightNav } from '@/components/navigation/TopRightNav';
import { Head } from './Head';

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    <div>
      <Head />
      <div className="absolute inset-0">
        <div className="relative flex h-full overflow-hidden sm:h-screen">
          <TopLeftNav />
          <TopRightNav />
          <BottomLeftNav />
          <MenuSideBar />
          <div className="relative flex flex-col w-full">
            {/* <Header /> */}
            <div className="relative w-full h-full pt-32 bg-black">
              {children}
              <div className="object-cover object-right w-full h-full bg-center bg-fill bg-warRoom" />
              <div id="sidebar-root">
                {/* Render children here using the AtlasSideBar component */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
