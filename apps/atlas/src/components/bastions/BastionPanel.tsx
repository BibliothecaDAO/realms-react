import { useEffect } from 'react';
import { useAtlasContext } from '@/context/AtlasContext';
import { useBastionContext } from '@/context/BastionContext';
import { useGetBastionsQuery } from 'mockup/bastionsData';
import { BastionThreejs } from '../ui/map/three/bastions/BastionThreejs';
import { BasePanel } from '../ui/panel/BasePanel';
import { TravelToBastionButton } from './ArmyActions';
import { BastionInfo } from './BastionInfo';

export const BastionPanel = () => {
  const {
    mapContext: { selectedAsset },
  } = useAtlasContext();

  const {
    bastionContext: { setBastion },
  } = useBastionContext();

  // mockup data
  const { data, loading, startPolling, stopPolling } = useGetBastionsQuery(
    parseInt(selectedAsset?.id ?? '0')
  );

  useEffect(() => {
    if (!loading && data) {
      setBastion(data);
    }
  }, [data, loading]);

  if (loading && !data) {
    return <div>{<div> No bastion with that id</div>}</div>;
  } else {
    return (
      <BasePanel open={true} style="lg:w-12/12">
        <BastionThreejs />
        <BastionInfo></BastionInfo>
        <TravelToBastionButton></TravelToBastionButton>
      </BasePanel>
    );
  }
};
