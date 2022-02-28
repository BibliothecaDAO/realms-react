export type LoreNodeType = 'root-contract' | 'branch-narrative';

export interface LDKRoot {
  contractAddress: string;
  name: string;
  nodeType: 'root-contract';
}

export interface LDKLayer {
  descriptions: string[];
  title: string;
}

export interface LDKSchema {
  root: LDKRoot;
  layers: LDKLayer[];
}
