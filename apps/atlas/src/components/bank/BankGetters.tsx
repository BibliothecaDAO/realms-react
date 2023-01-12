import { formatEther } from '@ethersproject/units';

export const displayRate = (rate: string) => {
  return (+formatEther(rate)).toFixed(4);
};

export const calculateLords = (rate: string, qty: number) => {
  return +formatEther(rate) * qty;
};
