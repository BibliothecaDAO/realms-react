import type { RefObject } from 'react';
import { useEffect } from 'react';

export function useOnClickOutsideElement(
  ref: RefObject<Element>,
  onClickOutside: (element?: Element) => void
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      onClickOutside(event.target);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref]);
}
