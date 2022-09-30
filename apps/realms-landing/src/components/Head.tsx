// Imports
import { default as HTMLHead } from 'next/head'; // Meta
import type { ReactElement } from 'react';

const meta = {
  title: 'Realms: ETERNUM game',
  description:
    'Realms are building a MMOCCG (massively-multiplayer on-chain composable game) on L2 StarkNet',
  website: 'https://realmseternum.com/',
  image: '/realms-art/desktop/createOrDestroy-desktop.png',
};

export function Head(): ReactElement {
  return (
    <HTMLHead>
      {/* Primary Meta Tags */}
      <title>{meta.title}</title>
      <meta content="text/html; charset=UTF-8" name="Content-Type" />
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />

      {/* OG + Faceook */}
      <meta name="og:type" content="website" />
      <meta name="og:url" content={meta.website} />
      <meta name="og:title" content={meta.title} />
      <meta name="og:description" content={meta.description} />
      <meta name="og:image" content={meta.image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.website} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      <link rel="icon" type="image/png" href="/favicon.ico"></link>
      {/* Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=IM+Fell+DW+Pica&family=IM+Fell+DW+Pica+SC&display=swap"
        rel="stylesheet"
      />
    </HTMLHead>
  );
}
