import { BaseRealmDetailPanel } from '@/app/realm/[id]/BaseRealmDetailPanel';
import { RealmLore } from '@/components/panels/Realms/details';
import type { GetRealmQuery } from '@/generated/graphql';
import { getRealm } from '@/lib/realm/getRealm';

export default async function Page({ params }) {
  const realm = await getRealm(params.id);

  return (
    <BaseRealmDetailPanel open={true}>
      <RealmLore realmName={realm?.name || ''} realmId={realm?.realmId || 0} />
    </BaseRealmDetailPanel>
  );
}
