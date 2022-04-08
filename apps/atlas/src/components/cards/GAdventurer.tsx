import { OrderIcon } from '@bibliotheca-dao/ui-lib';
import { rarityDescription, rarityColor } from 'loot-rarity';
import Image from 'next/image';
import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useUIContext } from '@/hooks/useUIContext';
import getGreatness from '@/services/getGreatness';
import { LootItemIcon } from '@/shared/LootItemIcon';
import { MarketplaceByPanel } from '@/shared/MarketplaceByPanel';
import { shortenAddress } from '@/util/formatters';
import type { GAProps } from '../../types';

const variantMaps: any = {
  small: { heading: 'lg:text-4xl', regions: 'lg:text-xl' },
};

export function GAdventurer(props: GAProps): ReactElement {
  const image = props.ga.id;
  const [metaData, setMetaData] = useState(null);
  const { gotoAssetId } = useUIContext();

  const mappedProperties = [
    'weapon',
    'chest',
    'head',
    'waist',
    'foot',
    'hand',
    'neck',
    'ring',
  ];

  useEffect(() => {
    const getMetadata = async () => {
      setMetaData(getGreatness(props.ga.id));
    };

    if (props.ga.id) {
      getMetadata();
    }
  }, [props.ga.id]);

  return (
    <div className="z-10 w-full h-auto p-1 text-white rounded-xl">
      {props.loading ? (
        <div className="">
          <div className="w-full h-64 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 rounded bg-white/40 animate-pulse" />
        </div>
      ) : (
        <div className="px-4 py-2 bg-black/60 rounded">
          <div className="flex justify-center">
            <OrderIcon size="lg" order={props.ga.order.toLowerCase()} />
          </div>

          <div
            className={`w-full text-center rounded-lg py-2 text-2xl uppercase tracking-widest`}
          >
            Order of {props.ga.order}
          </div>
          <div className=" sm:text-2xl">
            <div className="flex flex-col flex-wrap justify-between my-4 rounded sm:flex-row">
              <h3>
                Genesis Adventurer #{' '}
                <span className="font-semibold ">{props.ga.id}</span>
              </h3>
              {props.ga.currentOwner && (
                <h3>{shortenAddress(props.ga.currentOwner.address)}</h3>
              )}
              {props.flyto && (
                <div className="self-center text-lg">
                  <button
                    className={
                      'bg-white/20 rounded px-4 uppercase hover:bg-white/40'
                    }
                    onClick={() => {
                      gotoAssetId(props.ga.id, 'ga');
                    }}
                  >
                    fly to
                  </button>
                </div>
              )}
            </div>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="p-4 text-left uppercase tracking-widest text-lg">
                    Item
                  </th>
                  <th className="p-4 uppercase tracking-widest text-lg">
                    Greatness
                  </th>
                </tr>
              </thead>
              <tbody>
                {mappedProperties.map((item, index) => (
                  <tr key={index}>
                    <td className="pb-2">
                      <p
                        className={
                          'mt-1 flex  font-display text-[' +
                          rarityColor((props.ga as any)[item]) +
                          ']'
                        }
                      >
                        <LootItemIcon
                          className="self-center mr-4"
                          size="sm"
                          item={index.toString()}
                        />{' '}
                        <span className="self-center">
                          {(props.ga as any)[item]}
                        </span>
                      </p>
                    </td>
                    <td className="text-center font-display">
                      {metaData
                        ? (metaData as any).greatness[item.toLowerCase()]
                        : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <MarketplaceByPanel
              id={props.ga.id}
              collection="genesisadventurer"
              address="0x8db687aceb92c66f013e1d614137238cc698fedb"
            />
          </div>
        </div>
      )}
    </div>
  );
}
