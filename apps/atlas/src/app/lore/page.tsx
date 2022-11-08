// Import your Client Component
import { ArtBackground } from '@/components/map/ArtBackground';
import { LoreProvider } from '@/context/LoreContext';
// import { getCrypts } from '@/lib/crypt/getCrypts';
import { LorePanel } from './LorePanel';

export default async function Page() {
  // const crypts = await getCrypts({ orderBy: { realmId: 'asc' }, take: 20 });

  return (
    <LoreProvider>
      <LorePanel />
      <ArtBackground background="crypt" />
    </LoreProvider>
  );
}
