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
      containerClassName={'w-full lg:w-10/12 z-30 mx-16 my-20'}
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
