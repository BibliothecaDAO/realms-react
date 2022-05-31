import { BankPanel } from '@/components/panels/BankPanel';
import { RealmsPanel } from '@/components/panels/RealmsPanel';
import { BridgeRealmsSideBar } from '@/components/sidebars/BridgeRealmsSideBar';
import { RealmSideBar } from '@/components/sidebars/RealmsSideBar';
import { SettleRealmsSideBar } from '@/components/sidebars/SettleRealmsSideBar';
import { RealmProvider } from '@/context/RealmContext';
import Base from '@/pages/index';

export default function RealmPage() {
  return (
    <Base>
      <RealmProvider>
        <RealmsPanel />
        <RealmSideBar />
        <BridgeRealmsSideBar />
        <SettleRealmsSideBar />
      </RealmProvider>
    </Base>
  );
}
