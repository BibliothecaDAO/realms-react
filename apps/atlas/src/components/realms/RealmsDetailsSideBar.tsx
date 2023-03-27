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
      containerClassName="z-50 right-0 top-0 left-0 bottom-0 m-8 lg:my-24 lg:ml-24 lg:mr-12 !p-0"
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
