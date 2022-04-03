import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { useSettlingContext } from '@/context/SettlingContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';

interface RealmOverviewProps {
  realms: RealmFragmentFragment[];
}
const JOURNEY_1_ADDRESS = '0x17963290db8c30552d0cfa2a6453ff20a28c31a2';
const JOURNEY_2_ADDRESS = '0xcdfe3d7ebfa793675426f150e928cd395469ca53';

export function RealmOverview(props: RealmOverviewProps) {
  const testRealm = {
    name: 'Smutmum',
    order: 'anger',
    id: 1,
    resources: ['Wood', 'DragonHide', 'Coal', 'Ruby', 'Copper'],
    statistics: ['Happiness', 'Culture', 'Food', 'Population'],
    military: ['Offence', 'Defence', 'Last Attacked'],
  };
  const { account } = useWalletContext();
  const { toggleMenuType, selectedMenuType, setSelectedId } = useUIContext();
  const {
    state: { favouriteRealms },
    actions,
  } = useSettlingContext();

  const isBridgedViaGalleon = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_1_ADDRESS;
  const isBridgedViaCarrack = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_2_ADDRESS;
  const isYourRealm = (realm: RealmFragmentFragment) =>
    account && (account === realm.owner || account === realm.bridgedOwner);

  const openRealmDetails = (realmId: number) => {
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
        props.realms.slice(0, 10).map((realm: RealmFragmentFragment, index) => (
          <div
            key={index}
            className="flex w-full h-auto max-w-full mb-4 overflow-x-scroll border border-gray-500 border-double rounded shadow-md justify-evenly"
          >
            <div className="flex w-full p-8 text-gray-800 rounded-l bg-white/70">
              <OrderIcon
                className="self-center"
                size={'md'}
                order={realm.orderType}
              />
              <div className="self-center pl-6">
                <h5 className="text-gray-400">{realm.realmId}</h5>
                <h2 className="mb-3">{realm.name}</h2>
                {!isFavourite(realm) && (
                  <button
                    onClick={() => actions.addFavouriteRealm(realm.realmId)}
                  >
                    Add
                  </button>
                )}
                {isFavourite(realm) && (
                  <button
                    onClick={() => actions.removeFavouriteRealm(realm.realmId)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="w-full p-6 bg-black/70">
              {realm.resources?.map((resource, index) => {
                return (
                  <div className="flex my-4 font-bold " key={index}>
                    <ResourceIcon size="sm" resource={resource.type} />{' '}
                    <span className="ml-4 uppercase tracking-veryWide">
                      {resource.type}
                    </span>
                    <span className="self-end px-4 ml-auto uppercase tracking-veryWide">
                      100
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="w-full p-8 bg-gray-800/70">
              {' '}
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
            <div className="w-full p-8 bg-gray-700/70">
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
            </div>
            <div className="flex flex-col justify-center w-full p-8 space-y-3 bg-gray-600/70">
              {' '}
              <Button variant="default" className="w-full uppercase">
                fly to
              </Button>
              <Button
                onClick={() => openRealmDetails(realm.realmId)}
                variant="default"
                className="w-full uppercase"
              >
                details
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
