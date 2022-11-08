// Import your Client Component
import { BasePanel } from '@/app/components/ui/BasePanel';
import { ArtBackground } from '@/components/map/ArtBackground';
import { RealmsPanel } from '@/components/panels/RealmsPanel';
import { RealmProvider } from '@/context/RealmContext';
import { getRealm } from '@/lib/realm/getRealm';

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const { realm } = await getRealm(params.id);
  // Forward fetched data to your Client Component
  return (
    <>
      <RealmProvider>
        <div>name: {realm?.name}</div>
      </RealmProvider>
    </>
  );
}
