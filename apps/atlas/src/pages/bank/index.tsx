import { BankPanel } from '@/components/panels/BankPanel';
import { ResourceSwapSideBar } from '@/components/sidebars/ResourceSwapSideBar';
import { ResourceProvider } from '@/context/ResourcesContext';
import Base from '@/pages/index';

export default function BankPage() {
  return (
    <Base>
      <ResourceProvider>
        <BankPanel />
        <ResourceSwapSideBar />
      </ResourceProvider>
    </Base>
  );
}
