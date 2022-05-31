import { LootPanel } from '@/components/panels/LootPanel';
import { LootSideBar } from '@/components/sidebars/LootSideBar';
import { LootProvider } from '@/context/LootContext';
import Base from '@/pages/index';

export default function LootPage() {
  return (
    <Base>
      <LootProvider>
        <LootPanel />
        <LootSideBar />
      </LootProvider>
    </Base>
  );
}
