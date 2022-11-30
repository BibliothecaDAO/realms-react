import type React from 'react';

export type LoreNodeType = 'root-contract' | 'branch-narrative';

export interface LDKRoot {
  contractAddress: string;
  name: string;
  nodeType: 'root-contract';
}

type LoreDescription = React.ReactElement | string;

export interface LDKLayer {
  descriptions: LoreDescription[];
  title: string | React.ReactNode;
  end?: boolean;
}

export interface LDKSchema {
  root: LDKRoot;
  layers: LDKLayer[];
}
