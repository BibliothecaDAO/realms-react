import { FlyToInterpolator } from '@deck.gl/core';
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

export interface AtlasMap {
  navigateToAsset: (assetId: number, assetType: AssetType) => void;
  setViewState: (viewState: any) => void;
  viewState: any;
  selectedAsset: Asset;
  isMapLoaded: boolean;
  setIsMapLoaded: (loaded: boolean) => void;
}

export function useAtlasMap(): AtlasMap {
  const router = useRouter();
  const { asset } = router.query;
  const [selectedAsset, setSelectedAsset] = useState<Asset>(null!);
  const [coordinates, setCoordinates] = useState<Coordinate>(null!);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 3,
    pitch: 0,
    bearing: 0,
    bounds: [
      [-180, -180], // Southwest coordinates
      [180, 180], // Northeast coordinates
    ],
    transitionDuration: 0,
    transitionInterpolator: new FlyToInterpolator(),
  });

  // check for asset in query string
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

  // Update view state on coordinates change
  useEffect(() => {
    if (!coordinates) {
      return;
    }

    setViewState({
      ...coordinates,
      zoom: 8,
      pitch: 20,
      bearing: 0,
      bounds: [
        [-180, -180], // Southwest coordinates
        [180, 180], // Northeast coordinates
      ],
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, [coordinates?.latitude, coordinates?.latitude]);

  function navigateToAsset(assetId: number, assetType: AssetType) {
    if (!assetId) {
      return;
    }
    router.push(`/?asset=${assetType}${assetId}`, undefined, { shallow: true });
  }

  return {
    setViewState,
    viewState,
    navigateToAsset,
    selectedAsset,
    isMapLoaded,
    setIsMapLoaded,
  };
}
