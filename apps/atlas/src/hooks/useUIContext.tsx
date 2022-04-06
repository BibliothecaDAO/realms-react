/* eslint-disable @typescript-eslint/no-empty-function */
import { useRouter } from 'next/router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { BackgroundOptions } from '@/components/map/ArtBackground';
import { useBreakpoint } from '@/hooks/useBreakPoint';

import crypts from '../geodata/crypts_all.json';
import ga_bags from '../geodata/ga_bags.json';
import loot_bags from '../geodata/loot_bags.json';
import realms from '../geodata/realms.json';
export type AssetType = 'realm' | 'crypt' | 'loot' | 'ga' | undefined;

export type PanelType = 'trade' | 'bank' | 'library' | AssetType;

export type MenuType = 'resourceSwap' | PanelType;

export type AssetFilter = {
  value: AssetType;
  name: string;
  maxId: number;
};

type Coordinate = {
  longitude: number;
  latitude: number;
};

export const AssetFilters: AssetFilter[] = [
  { value: 'realm', name: 'Realm', maxId: 8000 },
  { value: 'crypt', name: 'C&C', maxId: 9000 },
  { value: 'loot', name: 'Loot', maxId: 8000 },
  {
    value: 'ga',
    name: 'GA',
    maxId: Math.max(
      ...ga_bags.features.map((feature) => parseInt(feature.properties.ga_id))
    ),
  },
];

interface UI {
  selectedId: string;
  setSelectedId: (id: string) => void;
  selectedAssetFilter: AssetFilter;
  setSelectedAssetFilter: (AssetFilter: AssetFilter) => void;
  selectedMenuType: MenuType;
  setMenuType: (menuType: MenuType) => void;
  toggleMenuType: (menuType: MenuType) => void;
  closeAll: (exclude?: MenuType) => void;
  gotoAssetId: (assetId: string | number, assetType: AssetType) => void;
  coordinates?: Coordinate;
  toggleArtBackground: (background?: BackgroundOptions) => void;
  artBackground: BackgroundOptions;
  mainMenu: boolean;
  toggleMainMenu: () => void;
  togglePanelType: (panelType: PanelType) => void;
  selectedPanel: PanelType;
}

const defaultUIContext: UI = {
  selectedId: '1',
  setSelectedId: (id: string) => {},
  selectedAssetFilter: AssetFilters[0],
  setSelectedAssetFilter: (AssetFilter: AssetFilter) => {},
  selectedMenuType: undefined,
  setMenuType: (menuType: MenuType) => {},
  toggleMenuType: (menuType: MenuType) => {},
  closeAll: (exclude?: MenuType) => {},
  gotoAssetId: (assetId: string | number, assetType: AssetType) => {},
  toggleArtBackground: (background?: BackgroundOptions) => {},
  artBackground: undefined,
  mainMenu: true,
  toggleMainMenu: () => {},
  togglePanelType: (panelType: PanelType) => {},
  selectedPanel: undefined,
};

const UIContext = createContext<UI>(defaultUIContext);

interface UIProviderProps {
  children: React.ReactNode;
}

function useQueryPOI() {
  const { query } = useRouter();
  const validQueries: AssetType[] = ['realm', 'crypt', 'loot', 'ga'];
  for (const assetType of validQueries) {
    if (assetType && parseInt(query[assetType] as string) > 0) {
      return {
        assetType: assetType as string,
        assetId: query[assetType] as string,
      };
    }
  }
  return null;
}

const assetFilterByType = (assetType: AssetType) =>
  AssetFilters.find(
    (assetFilter) => assetFilter.value === assetType
  ) as AssetFilter;

export const UIProvider = (props: UIProviderProps) => {
  return (
    <UIContext.Provider value={useUI()}>{props.children}</UIContext.Provider>
  );
};

function useCoordinates() {
  const [coordinates, setCoordinates] = useState<Coordinate>();
  const getAssetById = useCallback((assetId: string, assetType: AssetType) => {
    let asset;
    switch (assetType) {
      case 'realm':
        asset = realms.features.filter(
          (a: any) => a.properties.realm_idx === parseInt(assetId)
        );
        break;
      case 'crypt':
        asset = crypts.features.filter(
          (a: any) => a.properties.tokenId === parseInt(assetId)
        );
        break;
      case 'loot':
        asset = loot_bags.features.filter(
          (a: any) => a.properties.bag_id === parseInt(assetId)
        );
        break;
      case 'ga':
        asset = ga_bags.features.filter(
          (a: any) => parseInt(a.properties.ga_id) === parseInt(assetId)
        );
        break;
    }
    return asset;
  }, []);

  function updateCoordinatesByAsset(assetId: string, assetType: AssetType) {
    const asset = getAssetById(assetId + '', assetType);
    if (asset && asset[0]) {
      setCoordinates({
        longitude: asset[0].geometry.coordinates[0],
        latitude: asset[0].geometry.coordinates[1],
      });
    }
  }
  return {
    coordinates,
    updateCoordinatesByAsset,
  };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function useUI(): UI {
  const router = useRouter();
  const query = useQueryPOI();
  const [selectedId, setSelectedId] = useState(query ? query.assetId : '1');
  const [selectedAssetFilter, setSelectedAssetFilter] = useState(
    query ? assetFilterByType(query.assetType as AssetType) : AssetFilters[0]
  );
  const [artBackground, setArtBackground] = useState<BackgroundOptions>();
  const [mainMenu, setMainMenu] = useState(true);

  const [selectedMenuType, setMenuType] = useState<MenuType>(
    query ? (query.assetType as AssetType) : undefined
  );
  const [selectedPanel, setPanelType] = useState<PanelType>(undefined);

  const { coordinates, updateCoordinatesByAsset } = useCoordinates();

  // Update URL
  useEffect(() => {
    router.push(`?${selectedAssetFilter.value}=${selectedId}`, undefined, {
      shallow: true,
    });
  }, [selectedId, selectedAssetFilter]);

  // Sync AssetFilter with Menu
  useEffect(() => {
    if (selectedAssetFilter.value !== selectedMenuType) {
      setMenuType(selectedAssetFilter.value);
    }
  }, [selectedAssetFilter]);

  const closeAll = (exclude?: MenuType) => {
    if (!exclude) {
      setMenuType(undefined);
    } else if (selectedMenuType !== exclude) {
      setMenuType(exclude);
    }
  };
  const toggleArtBackground = (background?: BackgroundOptions) => {
    setArtBackground(background);
  };

  const toggleMenuType = (menuType: MenuType) => {
    if (selectedMenuType === menuType) {
      setMenuType(undefined);
    } else {
      setMenuType(menuType);
    }
  };

  const breakpoints: any = useBreakpoint();

  const togglePanelType = (panelType: PanelType) => {
    setMainMenu(false);
    if (selectedPanel === panelType) {
      setPanelType(undefined);
      setMenuType(undefined);
      setArtBackground(undefined);
    } else {
      setPanelType(panelType);
      if (panelType === 'bank') {
        setArtBackground('bank');
        if (breakpoints.lg) {
          setMenuType('resourceSwap');
        }
      } else if (panelType === 'trade') {
        setArtBackground('realm');
        if (breakpoints.lg) {
          setMenuType(panelType);
        }
      } else {
        setArtBackground('hero');
        if (breakpoints.lg) {
          setMenuType(panelType);
        }
      }
    }
  };

  const toggleMainMenu = () => {
    return setMainMenu(!mainMenu);
  };

  const gotoAssetId = (assetId: string | number, assetType: AssetType) => {
    setMenuType(assetType);
    setSelectedAssetFilter(assetFilterByType(assetType));
    setSelectedId(assetId + '');
    updateCoordinatesByAsset(assetId + '', assetType);
  };

  return {
    selectedId,
    setSelectedId,
    selectedAssetFilter,
    setSelectedAssetFilter,
    selectedMenuType,
    setMenuType,
    closeAll,
    toggleArtBackground,
    toggleMenuType,
    gotoAssetId,
    coordinates,
    artBackground,
    mainMenu,
    toggleMainMenu,
    togglePanelType,
    selectedPanel,
  };
}

export function useUIContext() {
  return useContext(UIContext);
}
