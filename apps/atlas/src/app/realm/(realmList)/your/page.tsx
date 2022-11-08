// Import your Client Component
import { BasePanel } from '@/app/components/ui/BasePanel';
import { ArtBackground } from '@/components/map/ArtBackground';
import { RealmProvider } from '@/context/RealmContext';
import { RealmListPanel } from '../RealmListPanel';

/* async function getPosts() {
  const res = await fetch('https://...');
  const posts = await res.json();
  return posts;
} */

export default async function Page() {
  // Fetch data directly in a Server Component
  // const recentPosts = await getPosts();
  // Forward fetched data to your Client Component
  return (
    <RealmProvider>
      <RealmListPanel /* recentPosts={recentPosts} */ />
    </RealmProvider>
  );
}
