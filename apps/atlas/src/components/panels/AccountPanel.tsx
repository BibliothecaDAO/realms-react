import { useEffect } from 'react';
import { useJourneyContext } from '@/context/JourneyContext';

export function AccountPanel() {
  const { state, actions } = useJourneyContext();
  useEffect(() => {
    console.log(state);
  }, [state]);
  return null;
}
