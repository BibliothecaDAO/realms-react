import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';

interface RealmOverviewsProps {
  realms: RealmFragmentFragment[];
}
const JOURNEY_1_ADDRESS = '0x17963290db8c30552d0cfa2a6453ff20a28c31a2';
const JOURNEY_2_ADDRESS = '0xcdfe3d7ebfa793675426f150e928cd395469ca53';

export function RealmOverviews(props: RealmOverviewsProps) {
  const testRealm = {
    name: 'Smutmum',
    order: 'anger',
    id: 1,
    resources: ['Wood', 'DragonHide', 'Coal', 'Ruby', 'Copper'],
    statistics: ['Happiness', 'Culture', 'Food', 'Population'],
    military: ['Offence', 'Defence', 'Last Attacked'],
  };
  const { account } = useWalletContext();
  const {
    toggleMenuType,
    selectedMenuType,
    setSelectedAssetType,
    setSelectedId,
    gotoAssetId,
    togglePanelType,
  } = useUIContext();
  const {
    state: { favouriteRealms },
    actions,
  } = useRealmContext();

  const isBridgedViaGalleon = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_1_ADDRESS;
  const isBridgedViaCarrack = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_2_ADDRESS;
  const isYourRealm = (realm: RealmFragmentFragment) =>
    account && (account === realm.owner || account === realm.bridgedOwner);

  const openRealmDetails = (realmId: number) => {
    setSelectedAssetType('realm');
    setSelectedId(realmId.toString());
    if (selectedMenuType !== 'realm') {
      toggleMenuType('realm');
    }
  };

  const isFavourite = (realm: RealmFragmentFragment) =>
    favouriteRealms.indexOf(realm.realmId) > -1;

  return (
    <div>
      {props.realms &&
        props.realms.map((realm: RealmFragmentFragment, index) => (
          <div
            key={index}
            className="flex flex-wrap w-full h-auto max-w-full mb-2 overflow-x-auto rounded justify-evenly"
          >
            {realm?.wonder && (
              <div className="text-gray-200 w-full p-2 tracking-veryWide shadow-inner text-xl text-center uppercase rounded-t bg-black/30 font-semibold border-gray-500">
                {realm?.wonder}
              </div>
            )}
            <div className="flex w-full p-2 text-white rounded-t-l bg-black/80 shadow-inner">
              <h3 className="ml-4 mb-1 self-center">
                <span className="text-gray-400 mr-4">{realm.realmId} | </span>
                {realm.name}
              </h3>
              <h4 className="px-4 mx-auto self-center p-1 border-gray-400 text-gray-400 text-xs rounded border">
                rank: {realm.rarityRank}
              </h4>
              <div className=" ml-auto flex">
                <span className="self-center uppercase tracking-widest">
                  {realm.orderType.toLowerCase().replace('_', ' ')}
                </span>

                <OrderIcon
                  className="self-center mx-3"
                  size={'md'}
                  order={realm.orderType.toLowerCase()}
                />
              </div>
            </div>
            <div className="flex w-1/2 sm:w-1/3 px-6 bg-black/50 shadow-inner">
              <div className="self-center">
                {realm.resources?.map((resource, index) => {
                  return (
                    <div className="flex my-4 font-bold " key={index}>
                      <ResourceIcon
                        size="sm"
                        resource={resource.type.replace('_', '')}
                      />{' '}
                      <span className="ml-4 uppercase tracking-veryWide">
                        {resource.type.replace('_', ' ')}
                      </span>
                      {/* <span className="self-end px-4 ml-auto uppercase tracking-veryWide">
                      100
                    </span> */}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex w-1/2 sm:w-1/3 px-6 bg-gray-800/60 shadow-inner">
              {' '}
              <div className="self-center w-full">
                {realm.traits?.map((trait, index) => {
                  return (
                    <div className="flex my-4 font-bold " key={index}>
                      <span className="ml-4 uppercase tracking-veryWide">
                        {trait.type}
                      </span>
                      <span className="self-end px-4 ml-auto uppercase tracking-veryWide">
                        {trait.qty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <div className="w-1/4 p-8 bg-gray-700/70">
              {' '}
              {testRealm.military.map((a, index) => {
                return (
                  <div className="flex my-4 font-bold " key={index}>
                    <span className="uppercase tracking-veryWide">{a}</span>
                    <span className="self-end px-4 ml-auto uppercase tracking-veryWide">
                      100
                    </span>
                  </div>
                );
              })}
            </div> */}
            <div className="flex sm:flex-col justify-center w-full sm:w-1/3 py-4 sm:py-0 px-6 space-x-2 sm:space-x-0 sm:space-y-3 bg-gray-600/70 shadow-inner">
              {' '}
              <Button
                onClick={() => {
                  togglePanelType('realm');
                  gotoAssetId(realm.realmId, 'realm');
                }}
                variant="primary"
                size="xs"
                className="w-full uppercase"
              >
                fly to
              </Button>
              <Button
                onClick={() => openRealmDetails(realm.realmId)}
                variant="secondary"
                size="xs"
                className="w-full "
              >
                details
              </Button>
              {!isFavourite(realm) && (
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => actions.addFavouriteRealm(realm.realmId)}
                >
                  Add
                </Button>
              )}{' '}
              {isFavourite(realm) && (
                <Button
                  size="xs"
                  variant="secondary"
                  className="w-full"
                  onClick={() => actions.removeFavouriteRealm(realm.realmId)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
