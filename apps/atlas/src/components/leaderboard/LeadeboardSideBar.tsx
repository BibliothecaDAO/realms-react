import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { BaseSideBarPanel } from '@/components/ui/sidebar/BaseSideBarPanel';
import { sidebarClassNames } from '@/constants/ui';
import AtlasSideBar from '../map/AtlasSideBar';
import { LeaderboardPanel } from './LeaderboardPanel';

type LeaderboardSideBarProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const LeaderboardSideBar = ({
  isOpen,
  onClose,
}: LeaderboardSideBarProps) => {
  const [delayedOpen, setDelayedOpen] = useState(false);

  // hack to prevent close without animation
  useEffect(() => {
    if (isOpen) {
      setDelayedOpen(true);
    } else {
      setTimeout(() => {
        setDelayedOpen(false);
      }, 300);
    }
  }, [isOpen]);

  return (
    <AtlasSideBar
      position="right"
      isOpen={isOpen}
      containerClassName="right-0 top-0 left-0 bottom-0 my-20 ml-20 mr-8 !p-0"
      overflowHidden={true}
    >
      {delayedOpen && <LeaderboardSideBarPanel onClose={onClose} />}
    </AtlasSideBar>
  );
};

type LeaderboardSideBarPanelProps = {
  onClose?: () => void;
};
export const LeaderboardSideBarPanel = (
  props: LeaderboardSideBarPanelProps
) => {
  return (
    <BaseSideBarPanel className="z-50 bg-cover !pt-0" position="left">
      <LeaderboardPanel />
    </BaseSideBarPanel>
  );
};
