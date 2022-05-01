import type { LorePoiFragmentFragment } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';

const pois = {
  1: { name: 'Scrolls', class: 'bg-red-500' },
  1000: { name: 'Realms', class: 'bg-indigo-500' },
  1001: { name: 'Realms Orders', class: 'bg-indigo-500' },
  1002: { name: 'Realms Resources', class: 'bg-indigo-500' },
  1003: { name: 'Realms Wonders', class: 'bg-indigo-500' },
  1004: { name: 'Realms Resources Exchange (AMM)', class: 'bg-indigo-500' },
  2000: { name: 'Crypts and Caverns', class: 'bg-orange-500' },
  3000: { name: 'Lords', class: 'bg-sky-500' },
};

type LorePOIProps = {
  poiId: string;
  assetId?: string;
  pois?: { [index: string]: LorePoiFragmentFragment };
  poisLoading?: boolean;
};

export const LorePOI = ({
  poiId,
  assetId,
  // pois,
  poisLoading,
}: LorePOIProps) => {
  const { openDetails } = useUIContext();

  const openSideBar = () => {
    if (assetId) {
      openDetails(poiId === '1000' ? 'realm' : 'crypt', assetId);
    }
  };

  // if (!poisLoading) {
  //   return null;
  // }

  return (
    <button
      className={`rounded-md font-normal underline inline-flex mb-1`}
      onClick={openSideBar}
    >
      {pois ? pois[poiId].name : null}
      {assetId ? `[${assetId}]` : null}
    </button>
  );
};
