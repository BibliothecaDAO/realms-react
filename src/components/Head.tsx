// Imports
import { default as HTMLHead } from "next/head"; // Meta
import React, { ReactElement, useState } from "react";

const meta = {
  title: "The Lootverse by Bibliotheca",
  description:
    "Custodians of an open source permissionless gaming ecosystem built on a L2 Zero-Knowledge rollup.",
  website: "https://lootverse.bibliothecadao.xyz/",
  image: "https://lootproject.com/meta.png",
};

export function Head(): ReactElement {
  return (
    <HTMLHead>
      {/* Primary Meta Tags */}
      <title>{meta.description}</title>
      <meta name="title" content={meta.description} />
      <meta name="description" content={meta.description} />

      {/* OG + Faceook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.website} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={meta.website} />
      <meta property="twitter:title" content={meta.title} />
      <meta property="twitter:description" content={meta.description} />
      <meta property="twitter:image" content={meta.image} />

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