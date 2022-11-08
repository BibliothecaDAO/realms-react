// Import your Client Component
import { ArtBackground } from '@/components/map/ArtBackground';
import { LootProvider } from '@/context/LootContext';
// import { getLoot } from '@/lib/crypt/getLoot';
import { LootPanel } from './LootPanel';

export default async function Page() {
  // const Loot = await getLoot({ orderBy: { realmId: 'asc' }, take: 20 });

  return (
    <LootProvider>
      <LootPanel />
      <ArtBackground background="warRoom" />
    </LootProvider>
  );
}
