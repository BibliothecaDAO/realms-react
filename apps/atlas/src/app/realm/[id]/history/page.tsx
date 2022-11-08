import type { ReactElement } from 'react';
import { BaseRealmDetailPanel } from '@/app/realm/[id]/BaseRealmDetailPanel';
import { RealmHistory } from '@/components/panels/Realms/details';
import { getRealm } from '@/lib/realm/getRealm';

export default async function Page({ params }) {
  return (
    <BaseRealmDetailPanel open={true}>
      <RealmHistory realmId={parseInt(params.id)} />
    </BaseRealmDetailPanel>
  );
}
