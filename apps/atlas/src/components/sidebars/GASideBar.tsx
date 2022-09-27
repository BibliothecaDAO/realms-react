import { useQuery } from '@apollo/client';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import { getGAQuery } from '@/hooks/graphql/queries';
import type { GAData } from '@/types/index';
import { GAdventurer } from '../cards/GAdventurer';
import AtlasSideBar from './AtlasSideBar';
import { BaseSideBarPanel } from './BaseSideBarPanel';

interface GASideBarProps {
  gaId: string;
  isOpen: boolean;
  onClose?: () => void;
}
export const GASideBar = ({ gaId, isOpen, onClose }: GASideBarProps) => {
  return (
    <AtlasSideBar isOpen={isOpen} containerClassName="w-full lg:w-5/12">
      {isOpen && <GAQuickView gaId={gaId} onClose={onClose} />}
    </AtlasSideBar>
  );
};

export const GAQuickView = ({
  gaId,
  onClose,
}: {
  gaId: string;
  onClose?: () => void;
}) => {
  const { loading, data } = useQuery<GAData>(getGAQuery, {
    variables: { id: gaId ?? '' },
    skip: !gaId,
  });

  return (
    <BaseSideBarPanel onClose={onClose}>
      {data && data.gadventurer && (
        <GAdventurer flyto={false} ga={data!.gadventurer} loading={loading} />
      )}
      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Helm className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )}
    </BaseSideBarPanel>
  );
};
