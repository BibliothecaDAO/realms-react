import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import clsx from 'clsx';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';

interface RealmOverviewsProps {
  realms: RealmFragmentFragment[];
  isBridge?: boolean;
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
    openDetails,
    toggleMenuType,
    selectedMenuType,
    gotoAssetId,
    togglePanelType,
  } = useUIContext();
  const {
    state: { favouriteRealms, selectedRealms },
    actions,
  } = useRealmContext();

  const isBridgedViaGalleon = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_1_ADDRESS;
  const isBridgedViaCarrack = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_2_ADDRESS;
  const isYourRealm = (realm: RealmFragmentFragment) =>
    account && (account === realm.owner || account === realm.bridgedOwner);

  const openRealmDetails = (realmId: number) => {
    openDetails('realm', realmId.toString());
    if (selectedMenuType !== 'realm') {
      toggleMenuType('realm');
    }
  };

  const isFavourite = (realm: RealmFragmentFragment) =>
    favouriteRealms.indexOf(realm.realmId) > -1;

  if (props.isBridge) {
    return (
      <div>
        {props.realms &&
          props.realms.map((realm: RealmFragmentFragment, index) => (
            <SelectableRealm
              key={index}
              realm={realm}
              actions={actions}
              isSelected={selectedRealms.indexOf(realm.realmId) > -1}
            />
          ))}
      </div>
    );
  }

  return (
    <div>
      {props.realms &&
        props.realms.map((realm: RealmFragmentFragment, index) => (
          <div
            key={index}
            className="flex flex-wrap w-full h-auto max-w-full mb-2 overflow-x-auto rounded justify-evenly"
          >
            {realm?.wonder && (
              <div className="w-full p-2 text-xl font-semibold text-center text-gray-200 uppercase border-gray-500 rounded-t shadow-inner tracking-veryWide bg-black/30">
                {realm?.wonder}
              </div>
            )}
            <div className="flex w-full p-2 text-white shadow-inner rounded-t-l bg-black/80">
              <h3 className="self-center mb-1 ml-4">
                <span className="mr-4 text-gray-400">{realm.realmId} | </span>
                {realm.name}
              </h3>
              <h4 className="self-center hidden p-1 px-4 mx-auto text-xs text-gray-400 border border-gray-400 rounded sm:block">
                rank: {realm.rarityRank}
              </h4>
              <div className="flex ml-auto ">
                <span className="self-center tracking-widest uppercase">
                  {realm.orderType.toLowerCase().replace('_', ' ')}
                </span>

                <OrderIcon
                  className="self-center mx-3"
                  size={'md'}
                  order={realm.orderType.toLowerCase()}
                />
              </div>
            </div>
            <div className="flex w-1/2 px-6 shadow-inner sm:w-1/3 bg-black/50">
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
            <div className="flex w-1/2 px-6 shadow-inner sm:w-1/3 bg-gray-800/60">
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
            <div className="flex justify-center w-full px-6 py-4 space-x-2 shadow-inner sm:flex-col sm:w-1/3 sm:py-0 sm:space-x-0 sm:space-y-3 bg-gray-600/70">
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

type SelectableRealmProps = {
  realm: RealmFragmentFragment;
  isSelected: boolean;
  actions: any;
};

function SelectableRealm(props: SelectableRealmProps) {
  const { realm, actions, isSelected } = props;

  function selectRealm() {
    actions.toggleRealmSelection(realm.realmId);
  }

  return (
    <button
      className="flex flex-wrap w-full h-auto max-w-full mb-2 overflow-x-auto rounded justify-between cursor-pointer"
      onClick={selectRealm}
    >
      <div
        className={clsx(
          `flex w-full p-2 text-white shadow-inner rounded-t-l`,
          isSelected ? `bg-black/60` : `bg-black/40`
        )}
      >
        <div
          className={`flex self-center ml-2 justify-center items-center w-8 h-8 bg-black rounded border-2 border-gray-900`}
        >
          {isSelected ? `✔️` : ``}
        </div>
        <h3 className="self-center mb-1 ml-4">
          <span className="mr-4 text-gray-400">{realm.realmId} | </span>
          {realm.name}
        </h3>
        <h4 className="self-center hidden p-1 justify-end px-4 text-xs text-gray-400 rounded sm:block">
          Location: L1 (Ethereum MainNet)
        </h4>
      </div>
    </button>
  );
}
