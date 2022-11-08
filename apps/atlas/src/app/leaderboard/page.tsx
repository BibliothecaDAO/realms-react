// Import your Client Component
import { ArtBackground } from '@/components/map/ArtBackground';
// import { getCrypts } from '@/lib/crypt/getCrypts';
import { LeaderboardPanel } from './LeaderboardPanel';

export default async function Page() {
  // const crypts = await getCrypts({ orderBy: { realmId: 'asc' }, take: 20 });

  return (
    <>
      <LeaderboardPanel />
      <ArtBackground background="realm" />
    </>
  );
}
