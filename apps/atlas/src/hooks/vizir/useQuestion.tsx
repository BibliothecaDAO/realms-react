import { useState } from 'react';

const useQuestion = () => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (props: any) => {
    console.log({ ...props });
    try {
      setLoading(true);
      const response = await fetch('/api/question', {
        method: 'POST',
        body: JSON.stringify({
          question: props.input,
        }),
      });

      const json = await response.json();

      console.log(json);

      setData(json);
    } catch (err) {
      // setError(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, data, error, loading, clear: () => setData(null) };
};

export default useQuestion;
