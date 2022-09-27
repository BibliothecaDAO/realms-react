import type { ReactElement } from 'react';
import React from 'react';
import { Header } from '@/components/navigation/Header';
import { MenuSideBar } from '@/components/navigation/MenuSideBar';
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
          <MenuSideBar />
          <div className="relative flex flex-col w-full">
            <Header />
            <div className="relative w-full h-full">
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
