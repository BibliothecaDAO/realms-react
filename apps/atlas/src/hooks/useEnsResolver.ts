import { useEffect, useState } from 'react';
import { shortenAddress } from '@/util/formatters';

type EnsData = {
  address: string | null;
  name: string | null;
  displayName: string;
  avatar: string | null;
  error?: string;
};

export function useEnsResolver(address: string) {
  const [ensData, setEnsData] = useState<EnsData>({
    address,
    displayName: shortenAddress(address),
    name: null,
    avatar: null,
  });

  useEffect(() => {
    fetch(`/api/ens/resolve/${address}`)
      .then((resp) => resp.json())
      .then((data) => {
        const displayName =
          data.displayName === data.address
            ? shortenAddress(data.address)
            : data.displayName;
        setEnsData({ ...data, displayName });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [address]);

  return ensData;
}
