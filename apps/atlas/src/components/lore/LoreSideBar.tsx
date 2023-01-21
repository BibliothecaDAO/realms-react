import { twMerge } from 'tailwind-merge';
import { BaseSideBarPanel } from '@/components/ui/sidebar/BaseSideBarPanel';
import { sidebarClassNames } from '@/constants/ui';
import { LoreProvider } from '@/context/LoreContext';
import AtlasSideBar from '../map/AtlasSideBar';
import { LorePanel } from './LorePanel';

type LoreSideBarProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const LoreSideBar = ({ isOpen, onClose }: LoreSideBarProps) => {
  return (
    <AtlasSideBar
      position="right"
      isOpen={isOpen}
      containerClassName="w-full !p-0"
      isTransparent={true}
      overflowHidden={true}
    >
      <LoreSideBarPanel onClose={onClose} />
    </AtlasSideBar>
  );
};

type LoreSideBarPanelProps = {
  onClose?: () => void;
};
export const LoreSideBarPanel = (props: LoreSideBarPanelProps) => {
  return (
    <BaseSideBarPanel className="z-50 bg-cover !pt-0" position="left">
      <LoreProvider>
        <LorePanel />
      </LoreProvider>
    </BaseSideBarPanel>
  );
};
