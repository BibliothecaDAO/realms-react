import type { ReactElement } from 'react';
import React from 'react';
import { FooterBlock } from './FooterBlock';
import { Head } from './Head';

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    <div className="bg-black min-h-screen">
      <Head />
      {children}
      <FooterBlock />
    </div>
  );
}
