import { twMerge } from 'tailwind-merge';
import { BaseSideBarPanel } from '@/components/ui/sidebar/BaseSideBarPanel';
import { sidebarClassNames } from '@/constants/ui';

import AtlasSideBar from '../map/AtlasSideBar';
import { BankPanel } from './BankPanel';

type ResourcesListSideBarProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const ResourcesListSideBar = ({
  isOpen,
  onClose,
}: ResourcesListSideBarProps) => {
  return (
    <AtlasSideBar
      position="right"
      isOpen={isOpen}
      containerClassName={twMerge(sidebarClassNames, 'ml-20 z-40').replace(
        'lg:w-5/12',
        'lg:w-1/2'
      )}
    >
      {isOpen && <ResourcesListSideBarPanel onClose={onClose} />}
    </AtlasSideBar>
  );
};

type ResourcesListSideBarPanelProps = {
  onClose?: () => void;
};
export const ResourcesListSideBarPanel = (
  props: ResourcesListSideBarPanelProps
) => {
  return (
    <BaseSideBarPanel className="z-50" position="right" onClose={props.onClose}>
      <div className="relative p-6 rounded">
        <BankPanel />
      </div>
    </BaseSideBarPanel>
  );
};
