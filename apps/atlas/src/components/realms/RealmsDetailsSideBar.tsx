import { twMerge } from 'tailwind-merge';
import { sidebarClassNames } from '@/constants/ui';
import type { RealmFragmentFragment } from '@/generated/graphql';
import type {
  BuildingDetail,
  BuildingFootprint,
  RealmFoodDetails,
} from '@/types/index';
import AtlasSideBar from '../map/AtlasSideBar';
import { BaseSideBarPanel } from '../ui/sidebar/BaseSideBarPanel';

import { RealmBuildModal } from './RealmBuildModal';

interface RealmSideBarProps {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
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
    >
      {props.isOpen && <RealmsQuickView {...props} />}
    </AtlasSideBar>
  );
};

function RealmsQuickView(props: RealmSideBarProps) {
  return (
    <BaseSideBarPanel onClose={props.onClose}>
      <RealmBuildModal {...props} />
    </BaseSideBarPanel>
  );
}
