import { twMerge } from 'tailwind-merge';
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
        'left-0 right-0 ml-24 mr-12 my-24 z-30 w-fit-content'
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
