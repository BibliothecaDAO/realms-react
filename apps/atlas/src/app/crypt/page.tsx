// Import your Client Component
import { ArtBackground } from '@/components/map/ArtBackground';
import { CryptProvider } from '@/context/CryptContext';
// import { getCrypts } from '@/lib/crypt/getCrypts';
import { CryptsPanel } from './CryptsPanel';

export default async function Page() {
  // const crypts = await getCrypts({ orderBy: { realmId: 'asc' }, take: 20 });

  return (
    <CryptProvider>
      <CryptsPanel />
      <ArtBackground background="crypt" />
    </CryptProvider>
  );
}
