import type { RealmFragmentFragment } from '@/generated/graphql';

export const ownerRelic = (realm: RealmFragmentFragment | undefined) => {
  return realm?.relic && realm?.relic[0] && realm?.relic[0].heldByRealm
    ? realm?.relic[0].heldByRealm
    : realm?.realmId;
};

export const relicsOwnedByRealm = (
  realm: RealmFragmentFragment | undefined
) => {
  return realm?.relicsOwned &&
    realm?.relicsOwned[0] &&
    realm?.relicsOwned.length
    ? realm?.relicsOwned.length
    : 0;
};

export const hasOwnRelic = (realm: RealmFragmentFragment | undefined) => {
  return realm?.relic && realm?.relic.length ? false : true;
};
