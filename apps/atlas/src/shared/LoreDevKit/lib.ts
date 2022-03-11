import type React from 'react';

export type LoreNodeType = 'root-contract' | 'branch-narrative';

export interface LDKRoot {
  contractAddress: string;
  name: string;
  nodeType: 'root-contract';
}

export interface LDKLayer {
  descriptions: string[] | React.ReactNode[];
  title: string | React.ReactNode;
}

export interface LDKSchema {
  root: LDKRoot;
  layers: LDKLayer[];
}
