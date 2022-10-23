import { useEffect, useState } from 'react';
import { toFelt } from 'starknet/dist/utils/number';

export const useStarkNetId = (addr: string) => {
  const [starknetId, setStarknetId] = useState<string | null>(null);

  useEffect(() => {
    if (addr) {
      fetch(
        ` https://goerli.indexer.starknet.id/addr_to_domain?addr=${toFelt(
          addr
        )}`
      )
        .then((response) => response.json())
        .then((a) => setStarknetId(a.domain as string));

      console.log(starknetId);
    }
  }, [addr]);

  return {
    starknetId,
  };
};
