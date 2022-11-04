// Import your Client Component
import { ArtBackground } from '@/components/map/ArtBackground';
import { BasePanel } from '@/components/panels/BasePanel';
import { RealmProvider } from '@/context/RealmContext';
import { getRealms } from '@/lib/realm/getRealms';
import { RealmListPanel } from './RealmListPanel';

export default async function Page() {
  const realms = await getRealms();
  console.log(realms);

  return (
    <RealmProvider>
      <RealmListPanel realms={realms} />
    </RealmProvider>
  );
}
