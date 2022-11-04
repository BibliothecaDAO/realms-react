import type { RealmFragmentFragment } from '@/generated/graphql';

export const getOrder = (realm: RealmFragmentFragment) => {
  return realm.orderType.toLowerCase();
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
