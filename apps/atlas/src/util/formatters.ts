export function shortenAddress(address: string) {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export function shortenAddressWidth(address: string, width: number) {
  if (!address) return '';
  return address.slice(0, width + 2) + '...' + address.slice(-width); // +2 for 0x
}
