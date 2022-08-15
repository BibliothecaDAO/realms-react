import { useRef, useEffect } from 'react';

export default function usePrevious<T>(value) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
