import { ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import { useStarknet } from '@starknet-react/core';
import { ethers, BigNumber } from 'ethers';
import { DAY } from '@/constants/buildings';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { BuildingDetail, TroopInterface } from '@/types/index';
import { shortenAddress } from '@/util/formatters';
import { findResourceName } from '@/util/resources';
interface TraitProps {
  trait: string;
  traitAmount?: number;
}

export const RealmStatus = (realm: RealmFragmentFragment) => {
  return [RealmStateStatus(realm), RealmVaultStatus(realm)]
    .filter(Boolean)
    .join(', ');
};

export const RealmStateStatus = (realm: RealmFragmentFragment) => {
  if (realm.bridgedOwner) {
    return 'Bridge Pending';
  }
  if (realm.settledOwner) {
    return 'Settled L2';
  }
  if (realm.ownerL2) {
    return 'Unsettled L2';
  } else {
    return 'Layer 1';
  }
};

export const RealmOwner = (realm: RealmFragmentFragment) => {
  return (
    realm?.settledOwner ||
    realm?.ownerL2 ||
    realm?.bridgedOwner ||
    realm?.owner ||
    '0'
  );
};

export const RealmVaultStatus = (realm: RealmFragmentFragment) => {
  if (!realm.lastVaultTime) {
    return '';
  }
  const now = Date.now();
  const lastVaultTime = new Date(realm.lastVaultTime);
  const minutesSinceLastVault = (now - lastVaultTime.getTime()) / 1000 / 60;
  const minutesToVault = DAY / 60; // 24 hours
  if (minutesSinceLastVault >= minutesToVault) {
    return `Raidable`;
  }

  const minutesRemaining = minutesToVault - minutesSinceLastVault;
  const hours = Math.floor(minutesRemaining / 60);
  const minutes = Math.floor(minutesRemaining % 60);
  if (hours > 0) {
    return `Raidable in ${hours}h ${minutes}m`;
  } else {
    return `Raidable in ${minutes}m`;
  }
};

export const TraitTable = (props: TraitProps) => {
  const traitSet = [
    {
      trait: 'Region',
      colour: 'bg-green-200',
      traitMax: 7,
      title: 'Regions',
    },
    { trait: 'City', colour: 'bg-amber-300', traitMax: 21, title: 'Cities' },
    {
      trait: 'Harbor',
      colour: 'bg-amber-500',
      traitMax: 35,
      title: 'Harbors',
    },
    {
      trait: 'River',
      colour: 'bg-blue-700',
      traitMax: 60,
      title: 'Rivers',
    },
  ];

  const getTrait = () => {
    return traitSet.find((a) => a.trait == props.trait);
  };

  const getWidth = () => {
    return ((props.traitAmount as any) / (getTrait()?.traitMax || 0)) * 100;
  };

  return (
    <div>
      <span className="flex justify-between font-semibold font-body">
        <span className="tracking-widest uppercase">{getTrait()?.title} </span>
        <span>
          {props.traitAmount} / {getTrait()?.traitMax}{' '}
        </span>
      </span>
      <div className="w-full my-1 rounded-full bg-stone-100/10">
        <div
          className={`h-3 ${getTrait()?.colour} shadow-inner rounded-full`}
          style={{
            width: `${getWidth()}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export const IsOwner = (owner?: string | null) => {
  const { account } = useStarknet();
  const starknetWallet = account ? BigNumber.from(account).toHexString() : '';

  if (account) {
    return starknetWallet == owner ? true : false;
  } else {
    return false;
  }
};

export const getOrder = (realm: RealmFragmentFragment) => {
  return realm.orderType.toLowerCase();
};

export const getAccountHex = (account: string) => {
  return ethers.BigNumber.from(account).toHexString();
};

export const squadStats = (squad: TroopInterface[] | undefined | null) => {
  if (!squad) {
    return { agility: 0, attack: 0, armor: 0, vitality: 0, wisdom: 0 };
  }
  return {
    agility: squad
      .map((troop) => troop.agility)
      .reduce((prev, curr) => prev + curr, 0),
    attack: squad
      .map((troop) => troop.attack)
      .reduce((prev, curr) => prev + curr, 0),
    armor: squad
      .map((troop) => troop.armor)
      .reduce((prev, curr) => prev + curr, 0),
    vitality: squad
      .map((troop) => troop.vitality)
      .reduce((prev, curr) => prev + curr, 0),
    wisdom: squad
      .map((troop) => troop.wisdom)
      .reduce((prev, curr) => prev + curr, 0),
  };
};

export const getTrait = (realm: any, trait: string) => {
  return realm?.traits?.find((o) => o.type === trait)
    ? realm.traits?.find((o) => o.type === trait).qty
    : '0';
};

export const trimmedOrder = (realm: RealmFragmentFragment | undefined) => {
  return (
    realm?.orderType
      ?.replaceAll('_', ' ')
      .replace('the ', '')
      .replace('the_', '')
      .toLowerCase() ?? ''
  );
};

export const ownerRelic = (realm: RealmFragmentFragment | undefined) => {
  return realm?.relic && realm?.relic[0] && realm?.relic[0].heldByRealm
    ? realm?.relic[0].heldByRealm
    : realm?.realmId;
};

export const relicsOwnedByRealm = (
  realm: RealmFragmentFragment | undefined
) => {
  return (
    <div>
      {realm?.relicsOwned && realm?.relicsOwned[0] && realm?.relicsOwned.length
        ? realm?.relicsOwned.length
        : 0}
    </div>
  );
};

export const resourcePillaged = (resources: any) => {
  return (
    <div className="w-full my-4">
      {resources.length ? (
        resources?.map((resource, index) => {
          const info = findResourceName(resource.resourceId);
          return (
            <div className="flex justify-between my-1 text-xl " key={index}>
              <div className="flex">
                <ResourceIcon
                  size="sm"
                  className="self-center"
                  resource={info?.trait?.replace('_', '') as string}
                />{' '}
                <span className="self-center ml-4 font-semibold uppercase">
                  {info?.trait}
                </span>
              </div>

              <div className="self-center font-semibold uppercase">
                {(+formatEther(resource.amount)).toLocaleString()}
              </div>
            </div>
          );
        })
      ) : (
        <span>No Resources pillaged</span>
      )}
    </div>
  );
};

export const hasOwnRelic = (realm: RealmFragmentFragment | undefined) => {
  return realm?.relic && realm?.relic.length ? false : true;
};

export const fetchRealmNameById = (id: number) => {
  return;
};
