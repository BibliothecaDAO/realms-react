import { useEffect, useState } from 'react';
import { getBlockNumber } from './settling/stark-contracts';

export const useBlockNumber = () => {
  const [data, setData] = useState<number>();
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getBlockNumber();
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // fetch every 10 seconds
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return { data, error, loading };
};
