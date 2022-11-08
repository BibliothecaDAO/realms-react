export {};
// Import your Client Component
import { BasePanel } from '@/app/components/ui/BasePanel';
import { ArtBackground } from '@/components/map/ArtBackground';
import { getRealm } from '@/lib/realm/getRealm';
import Food from './Food';

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const realm = await getRealm(params.id);
  // Forward fetched data to your Client Component
  return <>{realm && <Food realm={realm} buildings={undefined} />}</>;
}
