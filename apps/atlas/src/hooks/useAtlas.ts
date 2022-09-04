import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import crypts from '@/geodata/crypts.json';
import ga_bags from '@/geodata/ga.json';
import loot_bags from '@/geodata/loot.json';
import realms from '@/geodata/realms.json';
export type AssetType = 'realm' | 'crypt' | 'loot' | 'ga';

export type AssetFilter = {
  value: AssetType;
  name: string;
  maxId: number;
};

type Coordinate = {
  longitude: number;
  latitude: number;
};

type Asset = {
  id: string;
  type: AssetType;
};

// export const AssetFilters: AssetFilter[] = [
//   { value: 'realm', name: 'Realm', maxId: 8000 },
//   { value: 'crypt', name: 'C&C', maxId: 9000 },
//   { value: 'loot', name: 'Loot', maxId: 8000 },
//   {
//     value: 'ga',
//     name: 'GA',
//     maxId: Math.max(...ga_bags.features.map((feature) => parseInt(feature.id))),
//   },
// ];

export function useAtlas() {
  const router = useRouter();
  const { asset } = router.query;
  const [selectedAsset, setSelectedAsset] = useState<Asset>(null!);
  const [coordinates, setCoordinates] = useState<Coordinate>(null!);

  useEffect(() => {
    if (!router.isReady) return;

    // match asset
    const match = ((asset as string) ?? '').match(/(realm|crypt|loot|ga)(\d+)/);
    if (match) {
      setSelectedAsset({
        id: match[2],
        type: match[1] as AssetType,
      });

      setCoordinates(
        getCoordinates(match[2], match[1] as AssetType) as Coordinate
      );
    } else {
      setSelectedAsset(null!);
      setCoordinates(null!);
    }
  }, [router.isReady, asset]);

  function navigateToAsset(assetId: number, assetType: AssetType) {
    if (!assetId) {
      return;
    }
    router.push(`/?asset=${assetType}${assetId}`, undefined, { shallow: true });
  }

  return {
    navigateToAsset,
    coordinates,
    selectedAsset,
  };
}

function getCoordinates(assetId: string, assetType: AssetType) {
  let asset;
  switch (assetType) {
    case 'realm':
      asset = realms.features.filter((a: any) => a.id === parseInt(assetId));
      break;
    case 'crypt':
      asset = crypts.features.filter((a: any) => a.id === parseInt(assetId));
      break;
    case 'loot':
      asset = loot_bags.features.filter((a: any) => a.id === parseInt(assetId));
      break;
    case 'ga':
      asset = ga_bags.features.filter(
        (a: any) => parseInt(a.id) === parseInt(assetId)
      );
      break;
  }

  if (!asset || !asset[0]) {
    return null;
  }

  return {
    longitude: asset[0].coordinates[0] as number,
    latitude: asset[0].coordinates[1] as number,
  };
}
