import { useEffect, useState } from 'react';
import { toFelt } from 'starknet/dist/utils/number';

export const useStarkNetId = (addr: string) => {
  const [starknetId, setStarknetId] = useState<string | null>(null);

  useEffect(() => {
    if (addr) {
      fetch(`/api/starknetId/resolve?address=${addr}`)
        .then((response) => response.json())
        .then((a) => setStarknetId(a.domain as string));
    }
  }, [addr]);

  return {
    starknetId,
  };
};
