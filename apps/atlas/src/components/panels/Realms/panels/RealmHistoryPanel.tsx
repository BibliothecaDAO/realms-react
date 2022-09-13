import type { ReactElement } from 'react';
import { RealmHistory } from '@/components/panels/Realms/details';
import { BaseRealmDetailPanel } from '../BaseRealmDetailPanel';

interface RealmHistoryProps {
  realmId: number;
  open: boolean;
}

export function RealmHistoryPanel({
  realmId,
  open,
}: RealmHistoryProps): ReactElement {
  return (
    <BaseRealmDetailPanel open={open}>
      <RealmHistory realmId={realmId} />
    </BaseRealmDetailPanel>
  );
}
