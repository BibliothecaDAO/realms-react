import { useLazyQuery } from '@apollo/client';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { resources } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import type { LorePoiFragmentFragment } from '@/generated/graphql';
import { getRealmQuery, getCryptQuery } from '@/hooks/graphql/queries';
import { theOrders } from '@/util/theOrders';

const pois = {
  1: { name: 'Scrolls', class: 'bg-red-500' },
  1000: { name: 'Realms', class: 'bg-indigo-500', openDetailsName: 'realm' },
  1001: { name: 'Realms Orders', class: 'bg-indigo-500' },
  1002: { name: 'Realms Resources', class: 'bg-indigo-500' },
  1003: { name: 'Realms Wonders', class: 'bg-indigo-500' },
  1004: { name: 'Realms Resources Exchange (AMM)', class: 'bg-indigo-500' },
  2000: {
    name: 'Crypts and Caverns',
    class: 'bg-orange-500',
    openDetailsName: 'crypt',
  },
  3000: { name: 'Lords/Wallet', class: 'bg-sky-500' },
  // Loot
  4000: { name: 'Loot Bags', class: 'bg-sky-500' },
  4001: { name: 'Loot Bags', class: 'bg-sky-500' },
  //
  5000: { name: 'GA', class: 'bg-sky-500' },
  6000: { name: 'Loot Bags', class: 'bg-sky-500' },
  // 4000: { name: 'Loot Bags', class: 'bg-sky-500' },
  // 4000: { name: 'Loot Bags', class: 'bg-sky-500' },
};

// GAs, Atlas co-ordinates, Raid ID)

type LorePOIProps = {
  poiId: string;
  assetId?: string;
  actions?: {
    setSelectedCryptId?: Dispatch<SetStateAction<string>>;
    setSelectedRealmId?: Dispatch<SetStateAction<string>>;
  };
};

export const LorePOI = ({ poiId, assetId, actions }: LorePOIProps) => {
  const openSideBar = () => {
    if (!assetId) return;
    switch (poiId) {
      case '1000':
        actions?.setSelectedRealmId
          ? actions?.setSelectedRealmId(assetId)
          : null;
        // navigateToAsset(+assetId, 'realm');
        break;
      case '2000':
        actions?.setSelectedCryptId
          ? actions?.setSelectedCryptId(assetId)
          : null;
        break;

      default:
    }
  };

  let poiName;
  let loadQuery = false;
  let query = getRealmQuery;
  let variables = { id: assetId };

  // change the useLazyQuery params if needed
  if (poiId == ('2000' || 'crypt')) {
    query = getCryptQuery;
    variables = { id: assetId };
  }

  const [load, { data }] = useLazyQuery(query, {
    variables,
  });

  // actually set the poiName
  switch (poiId) {
    case '1000':
    case 'realm':
      loadQuery = true;
      poiName = data?.realm?.name;
      break;
    case '1001':
    case 'order':
      // TODO: find better way than parseInt(assetId || "") ?
      poiName = 'the Order of ' + theOrders[parseInt(assetId || '')]?.name;
      break;
    case '1002':
    case 'resource':
      poiName = resources[parseInt(assetId || '')]?.trait;
      break;
    case '1003':
    case 'wonder':
      loadQuery = true;
      poiName = data?.realm?.wonder ? data?.realm?.wonder : 'unlinked wonder';
      break;
    case '2000':
    case 'crypt':
      loadQuery = true;
      poiName = data?.dungeon?.name;
      break;
  }

  // only call useLazyQuery if needed
  useEffect(() => {
    if (loadQuery) {
      load();
    }
  }, []);

  const clickable = ['1000', '2000'].includes(poiId);

  return (
    <button
      className={`rounded-md font-normal ${
        clickable ? 'underline' : ''
      } inline-flex mb-1`}
      onClick={openSideBar}
    >
      {pois && !poiName ? pois[poiId]?.name : null}
      {poiName}
      {assetId ? `[${assetId}]` : null}
    </button>
  );
};
