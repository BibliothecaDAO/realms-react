'use client';

import useIsOwner from '@/hooks/useIsOwner';
import { shortenAddress } from '@/util/formatters';

export function RealmOwner(realm) {
  const isOwner = useIsOwner(realm?.settledOwner);

  return <>{isOwner ? 'you' : shortenAddress(realm?.settledOwner || '')}</>;
}
