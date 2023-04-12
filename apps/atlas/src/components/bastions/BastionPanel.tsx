import { useEffect } from 'react';
// import { useGetBastionsQuery } from 'mockup/bastionsData';
import { useAtlasContext } from '@/context/AtlasContext';
import { useBastionSettersContext } from '@/context/BastionContext';
import type { Bastion } from '@/generated/graphql';
import { useGetBastionQuery } from '@/generated/graphql';
// import { useGetBastionQuery } from 'mockup/bastionsData';
import { BastionThreejs } from '../ui/map/three/bastions/BastionThreejs';
import { TravelToBastion } from './ArmyActions';
import { getEmptyBastion } from './BastionGetters';
import { BastionInfo } from './BastionInfo';
import { BastionOverview } from './BastionOverview';

export const BastionPanel = () => {
  const {
    mapContext: { selectedAsset },
  } = useAtlasContext();

  const { setBastion } = useBastionSettersContext();

  // mockup data
  const { data, loading, startPolling, stopPolling } = useGetBastionQuery({
    variables: { id: parseInt(selectedAsset?.id || '0') },
  });

  useEffect(() => {
    if (loading) stopPolling();
    else startPolling(5000);

    return stopPolling;
  }, [loading, data]);

  useEffect(() => {
    if (!loading && data?.bastion) {
      setBastion(data.bastion as Bastion);
    } else {
      if (selectedAsset?.id) {
        const emptyBastion = getEmptyBastion(parseInt(selectedAsset.id));
        if (emptyBastion) {
          setBastion(emptyBastion);
        }
      }
    }
  }, [data, loading, selectedAsset]);

  if ((loading && !data) || !selectedAsset) {
    return <div></div>;
  } else {
    return (
      <div className="absolute top-0 bottom-0 rigth-0 left-0 w-full h-full">
        <BastionThreejs />
        <BastionInfo />
        <TravelToBastion />
        <BastionOverview />
      </div>
    );
  }
};
