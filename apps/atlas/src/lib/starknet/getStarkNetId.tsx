import { toFelt } from 'starknet/dist/utils/number';

export async function getStarkNetId(addr?: string) {
  if (addr) {
    const res = await fetch(
      `https://goerli.indexer.starknet.id/addr_to_domain?addr=${toFelt(addr)}`
    );
    const result = await res.json();

    return result.domain;
  }
}
