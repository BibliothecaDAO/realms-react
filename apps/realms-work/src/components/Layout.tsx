import type { ReactElement } from 'react';
import React from 'react';
import { FooterBlock } from './FooterBlock';
import { Head } from './Head';
import { Header } from './Header';
export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    <div className="min-h-screen bg-black">
      <Head />
      {/* <Header /> */}
      {children}
      <FooterBlock />
    </div>
  );
}
