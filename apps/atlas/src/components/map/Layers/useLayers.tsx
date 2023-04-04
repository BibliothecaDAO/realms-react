import { IconLayer } from '@deck.gl/layers';
import { useMemo } from 'react';
import { useAtlasContext } from '@/context/AtlasContext';
import bastions from '@/geodata/bastions.json';
import realms from '@/geodata/realms_resources.json';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { ItemViewLevel } from '../MapModule';

export const useLayers = ({ selectedId }) => {
  const { mapContext } = useAtlasContext();
  const { userRealms, userData } = useUsersRealms();

  const bastionsFormatted = bastions?.features.map((a) => {
    return {
      coordinates: [a.xy[0], a.xy[1]],
      id: a.id,
    };
  });

  const userArmiesFormatted = userData?.attackingArmies
    ?.filter((a) => a.armyId !== 0 || a.destinationRealmId !== 0)
    ?.map((a) => {
      return {
        coordinates: realms.features.find((b) => b.id === a.destinationRealmId)
          ?.xy,
        id: a.destinationRealmId,
      };
    });
  const userRealmsFormatted = userRealms?.realms.map((a) => {
    return {
      coordinates: [a.longitude, a.latitude],
      id: a.realmId,
    };
  });

  const userRealmIds = userRealms?.realms.map((a) => {
    return a.realmId;
  });

  const filteredUserRealmsFromMain = realms.features.filter(
    (d) => !userRealmIds?.includes(d.id)
  );

  const layers = useMemo(() => {
    const bastions = new IconLayer({
      id: 'bastion',
      data: bastionsFormatted,
      getIcon: (d: any) => ({
        url: 'https://cdn-icons-png.flaticon.com/512/2828/2828009.png',
        width: 128,
        height: 128,
        anchorY: 100,
      }),
      sizeUnits: 'pixels',
      pickable: true,
      visible: true,
      sizeScale: 50,
      sizeMinPixels: 6,
      getPosition: (d: any) => d.coordinates,
      onClick: (info: any) => {
        mapContext.navigateToAsset(info.object.id, 'bastion');
      },
    });
    const armies = new IconLayer({
      id: 'army',
      data: userArmiesFormatted,
      getIcon: (d: any) => ({
        url: 'https://cdn-icons-png.flaticon.com/512/3612/3612777.png',
        width: 128,
        height: 128,
        anchorY: d.id === parseInt(selectedId) ? 200 : 100,
      }),
      sizeUnits: 'pixels',
      pickable: true,
      visible: true,
      sizeScale: 5,
      sizeMinPixels: 6,
      getSize: (d) => 10,
      getPosition: (d: any) => d.coordinates,
      onClick: (info: any) => {
        mapContext.navigateToAsset(info.object.id, 'realm');
      },
    });
    const ownRealms = new IconLayer({
      id: 'own-realms',
      data: userRealmsFormatted,
      getIcon: (d) => ({
        url: '/real_icon-fill.png',
        width: 128,
        height: 128,
        anchorY: 100,
      }),
      pickable: true,
      sizeScale: 5,
      getPosition: (d: any) => d.coordinates,
      getSize: (d) => 10,
      onClick: (info: any) => {
        mapContext.navigateToAsset(info.object.id, 'realm');
      },
      updateTriggers: {
        getIcon: parseInt(selectedId),
      },
    });
    const sRealms = new IconLayer({
      id: 'srealms',
      data: filteredUserRealmsFromMain,
      getIcon: (d: any) => ({
        url:
          d.id === parseInt(selectedId)
            ? '/real_icon-fill.png'
            : '/real_icon-line.png',
        width: 128,
        height: 128,
        anchorY: 100,
      }),
      sizeUnits: 'pixels',
      pickable: true,
      visible: mapContext.viewState.zoom < ItemViewLevel ? false : true,
      sizeScale: 50,
      sizeMinPixels: 6,
      getPosition: (d: any) => d.xy,

      onClick: (info: any) => {
        mapContext.navigateToAsset(info.object.id, 'realm');
      },
    });

    return [bastions, armies, ownRealms, sRealms];
  }, [userArmiesFormatted, selectedId, mapContext]);

  return { layers };
};
