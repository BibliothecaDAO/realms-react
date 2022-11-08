// Import your Client Component
import { BasePanel } from '@/app/components/ui/BasePanel';
import { ArtBackground } from '@/components/map/ArtBackground';
import { RealmProvider } from '@/context/RealmContext';
import { getRealms } from '@/lib/realm/getRealms';
import { RealmListPanel } from './RealmListPanel';

export default async function Page() {
  const realms = await getRealms({ orderBy: { realmId: 'asc' }, take: 20 });

  return (
    <RealmProvider>
      <RealmListPanel realms={realms} />
    </RealmProvider>
  );
}
