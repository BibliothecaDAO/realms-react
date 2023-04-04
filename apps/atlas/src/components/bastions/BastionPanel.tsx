import { useEffect } from 'react';
// import { useGetBastionsQuery } from 'mockup/bastionsData';
import { useAtlasContext } from '@/context/AtlasContext';
import { useBastionSettersContext } from '@/context/BastionContext';
import { useGetBastionQuery } from '@/generated/graphql';
// import { useGetBastionQuery } from 'mockup/bastionsData';
import { BastionThreejs } from '../ui/map/three/bastions/BastionThreejs';
import { BasePanel } from '../ui/panel/BasePanel';
import { TravelToBastionButton } from './ArmyActions';
import { BastionInfo } from './BastionInfo';

export const BastionPanel = () => {
  const {
    mapContext: { selectedAsset },
  } = useAtlasContext();

  const { setBastion } = useBastionSettersContext();

  // mockup data
  const { data, loading, startPolling, stopPolling } = useGetBastionQuery();

  useEffect(() => {
    if (loading) stopPolling();
    else startPolling(5000);

    return stopPolling;
  }, [loading, data]);

  useEffect(() => {
    if (!loading && data) {
      // TODOBASTIONS: don't take the first one
      setBastion(data.bastions[0]);
    }
  }, [data, loading]);

  if (loading && !data) {
    return <div></div>;
  } else {
    return (
      <div className="absolute top-0 bottom-0 rigth-0 left-0 w-full h-full">
        <BastionThreejs />
        <BastionInfo></BastionInfo>
        <TravelToBastionButton></TravelToBastionButton>
      </div>
    );
  }
};
