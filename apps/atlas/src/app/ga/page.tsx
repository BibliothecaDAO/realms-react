// Import your Client Component
import { ArtBackground } from '@/components/map/ArtBackground';
import { GaProvider } from '@/context/GaContext';
// import { getCrypts } from '@/lib/crypt/getCrypts';
import { GaPanel } from './GaPanel';

export default async function Page() {
  // const crypts = await getCrypts({ orderBy: { realmId: 'asc' }, take: 20 });

  return (
    <GaProvider>
      <GaPanel />
      <ArtBackground background="warRoom" />
    </GaProvider>
  );
}
