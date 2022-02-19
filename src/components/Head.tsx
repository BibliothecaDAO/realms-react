// Imports
import { default as HTMLHead } from "next/head"; // Meta
import React, { ReactElement, useState } from "react";

export function Head(): ReactElement {
  return (
    <HTMLHead>
      {/* Primary Meta Tags */}
      <title>Lootverse</title>
      <meta name="title" content="Realms" />
      <meta
        name="description"
        content="Custodians of an open source permissionless gaming ecosystem built on a L2 Zero-Knowledge rollup."
      />

      {/* OG + Faceook */}
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content="https://https://lootverse.bibliothecadao.xyz/"
      />
      <meta property="og:title" content="Loot" />
      <meta
        property="og:description"
        content="Loot is randomized adventurer gear generated and stored on chain."
      />
      <meta property="og:image" content="https://lootproject.com/meta.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:url"
        content="https://https://lootverse.bibliothecadao.xyz/"
      />
      <meta property="twitter:title" content="Loot" />
      <meta
        property="twitter:description"
        content="Loot is randomized adventurer gear generated and stored on chain."
      />
      <meta
        property="twitter:image"
        content="https://lootproject.com/meta.png"
      />

      {/* Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Inconsolata:wght@300&display=swap"
        rel="stylesheet"
      />
    </HTMLHead>
  );
}
