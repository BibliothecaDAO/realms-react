import { GaPanel } from '@/components/panels/GaPanel';
import { GASideBar } from '@/components/sidebars/GASideBar';
import { GaProvider } from '@/context/GaContext';
import Base from '@/pages/index';

export default function GaPage() {
  return (
    <Base>
      <GaProvider>
        <GaPanel />
        <GASideBar />
      </GaProvider>
    </Base>
  );
}
