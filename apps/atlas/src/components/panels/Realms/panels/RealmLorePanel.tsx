import { RealmLore } from '@/components/panels/Realms/details';
import type { GetRealmQuery } from '@/generated/graphql';
import { BaseRealmDetailPanel } from '../BaseRealmDetailPanel';

type Prop = {
  realm?: GetRealmQuery;
  open: boolean;
};

const RealmLorePanel: React.FC<Prop> = ({ realm, open }) => {
  return (
    <BaseRealmDetailPanel open={open}>
      <RealmLore
        realmName={realm?.realm.name || ''}
        realmId={realm?.realm.realmId || 0}
      />
    </BaseRealmDetailPanel>
  );
};

export default RealmLorePanel;
