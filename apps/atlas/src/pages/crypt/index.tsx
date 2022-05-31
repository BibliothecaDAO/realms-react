import { CryptsPanel } from '@/components/panels/CryptsPanel';
import { CryptsSideBar } from '@/components/sidebars/CryptsSideBar';
import { CryptProvider } from '@/context/CryptContext';
import Base from '@/pages/index';

export default function CryptPage() {
  return (
    <Base>
      <CryptProvider>
        <CryptsPanel />
        <CryptsSideBar />
      </CryptProvider>
    </Base>
  );
}
