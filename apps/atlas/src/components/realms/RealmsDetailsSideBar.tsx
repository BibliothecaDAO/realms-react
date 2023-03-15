import { twMerge } from 'tailwind-merge';
import { sidebarClassNames } from '@/constants/ui';
import type { RealmFragmentFragment } from '@/generated/graphql';
import type { BuildingDetail, BuildingFootprint } from '@/types/index';
import AtlasSideBar from '../map/AtlasSideBar';
import { BaseSideBarPanel } from '../ui/sidebar/BaseSideBarPanel';
import { RealmModal } from './RealmModal';

interface RealmSideBarProps {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
  availableFood: number | undefined;
  buildingUtilisation: BuildingFootprint | undefined;
  isOpen: boolean;
  onClose?: () => void;
}

export const RealmsDetailSideBar = (props: RealmSideBarProps) => {
  return (
    <AtlasSideBar
      isOpen={props.isOpen}
      containerClassName={twMerge(
        sidebarClassNames,
        'left-0 right-0 lg:ml-24 lg:mr-12 lg:my-24 '
      )}
      onClose={props.onClose}
    >
      {props.isOpen && (
        <BaseSideBarPanel onClose={props.onClose}>
          <RealmModal {...props} />
        </BaseSideBarPanel>
      )}
    </AtlasSideBar>
  );
};
