import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';

export default async function RealmLayout({ children, params }) {
  return (
    <>
      <section>{children}</section>
      <ArtBackground background="bank" />
    </>
  );
}
