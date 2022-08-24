import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { useStarknet } from '@starknet-react/core';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { TroopSlot } from '@/constants/troops';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { RealmStatus, squadStats } from '@/shared/Getters/Realm';
import SquadStatistics from '@/shared/squad/SquadStatistics';
import { findResourceName } from '@/util/resources';
import { RealmResources } from './RealmResources';
interface RealmOverviewsProps {
  realms: RealmFragmentFragment[];
  isYourRealms?: boolean;
}

const JOURNEY_1_ADDRESS = '0x17963290db8c30552d0cfa2a6453ff20a28c31a2';
const JOURNEY_2_ADDRESS = '0xcdfe3d7ebfa793675426f150e928cd395469ca53';

export function RealmOverviews(props: RealmOverviewsProps) {
  const router = useRouter();
  const { account } = useWalletContext();
  const { account: starkAccount } = useStarknet();
  const {
    openDetails,
    toggleMenuType,
    selectedMenuType,
    gotoAssetId,
    togglePanelType,
  } = useAtlasContext();
  const {
    state: { favouriteRealms },
    actions,
  } = useRealmContext();

  const isBridgedViaGalleon = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_1_ADDRESS;
  const isBridgedViaCarrack = (realm: RealmFragmentFragment) =>
    realm.owner === JOURNEY_2_ADDRESS;

  const isYourRealm = (realm: RealmFragmentFragment) =>
    (account &&
      (account.toLowerCase() === realm.owner ||
        account.toLowerCase() === realm.bridgedOwner)) ||
    (starkAccount &&
      (starkAccount.toLowerCase() === realm.ownerL2 ||
        starkAccount.toLowerCase() === realm.settledOwner));

  const openRealmDetails = (realmId: number) => {
    openDetails('realm', realmId.toString());
    if (selectedMenuType !== 'realm') {
      toggleMenuType('realm');
    }
  };

  const isFavourite = (realm: RealmFragmentFragment) =>
    favouriteRealms.indexOf(realm.realmId) > -1;
  let bridgeRow;

  if (props.isYourRealms) {
    bridgeRow = (
      <div className={`justify-between mb-3`}>
        <div className="flex">
          You have X Realms on L1 (Ethereum)
          <Button
            variant="primary"
            size="sm"
            className={clsx('')}
            onClick={() => toggleMenuType('bridgeRealms')}
          >
            Bridge L1 {'><'} L2
          </Button>
        </div>
        <div className="flex">
          You have X unsettled Realms
          <Button
            variant="primary"
            size="sm"
            className=""
            onClick={() => toggleMenuType('settleRealms')}
          >
            Settle Realms
          </Button>
        </div>
      </div>
    );
  }

  // Filtering out old realms
  const usedRealms = [897, 5455, 555];

  const filteredRealms = props.realms.filter(
    (item) => !usedRealms.includes(item.realmId)
  );
  return (
    <div>
      {/* {bridgeRow} */}

      {props.realms &&
        filteredRealms.map((realm: RealmFragmentFragment, index) => (
          <div
            key={index}
            className="flex flex-wrap w-full h-auto max-w-full p-2 bg-black/95 shadow-black justify-evenly "
          >
            {realm?.wonder && (
              <div className="w-full p-2 text-xl font-semibold text-center uppercase shadow-inner tracking-veryWide bg-black/90">
                {realm?.wonder}
              </div>
            )}
            <div className="flex w-full p-3 py-4 bg-black border-4 border-b-4 border-double border-white/10 ">
              <h2 className="self-center mb-1 ml-4 font-lords">
                <span className="mr-1 font-semibold text-gray-400 font-body opacity-70">
                  {realm.realmId} |{' '}
                </span>
                {realm.name}
              </h2>

              {/* <h4 className="self-center hidden p-1 px-4 mx-auto text-xs text-gray-400 border border-gray-400 rounded sm:block">
                rank: {realm.rarityRank}
              </h4> */}
              {/* <h4 className="self-center hidden p-1 px-4 mx-auto text-xs sm:block">
                {RealmStatus(realm)}
              </h4> */}

              <div className="flex self-center ml-auto">
                <div className="flex self-center space-x-2">
                  <div>
                    {!isFavourite(realm) && (
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => actions.addFavouriteRealm(realm.realmId)}
                      >
                        +
                      </Button>
                    )}{' '}
                    {isFavourite(realm) && (
                      <Button
                        size="xs"
                        variant="secondary"
                        className="w-full"
                        onClick={() =>
                          actions.removeFavouriteRealm(realm.realmId)
                        }
                      >
                        -
                      </Button>
                    )}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        togglePanelType('realm');
                        gotoAssetId(realm.realmId, 'realm');
                      }}
                      variant="outline"
                      size="xs"
                      className="w-full uppercase"
                    >
                      fly
                    </Button>
                  </div>
                </div>

                <OrderIcon
                  withTooltip
                  className="self-center mx-3"
                  size={'md'}
                  order={realm.orderType.toLowerCase()}
                />
              </div>
            </div>
            {/* <div className="flex w-1/2 p-6 shadow-inner bg-gray-1000 sm:w-1/3">
              <div className="self-center">
                {realm.resources?.map((resource, index) => {
                  const info = findResourceName(resource.resourceId);
                  return (
                    <div className="flex my-1 font-bold " key={index}>
                      <ResourceIcon
                        size="xs"
                        className="self-center"
                        resource={info?.trait?.replace('_', '') as string}
                      />{' '}
                      <span className="ml-4 uppercase tracking-veryWide opacity-80">
                        {info?.trait}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div> */}
            {/* <div className="flex w-1/2 px-6 shadow-inner sm:w-1/3 bg-gray-800/60">
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
            </div> */}
            <div className="w-full p-1 bg-black sm:w-2/3">
              <RealmResources showRaidable realm={realm} loading={false} />
            </div>
            <div className="w-1/2 p-6 bg-black shadow-inner sm:w-1/3">
              <h3 className="mb-4">Defending Army</h3>
              <div className="self-center w-full font-semibold tracking-widest uppercase opacity-80">
                <SquadStatistics
                  className="pl-4"
                  reversed
                  troops={realm.troops || []}
                  slot={TroopSlot.defending}
                ></SquadStatistics>
              </div>
              <div className="flex justify-center flex-grow w-full px-6 py-2 space-x-2 sm:flex-col sm:w-full sm:py-4 sm:space-x-0 sm:space-y-3">
                {' '}
                {isYourRealm(realm) && (
                  <div>
                    {RealmStatus(realm) === 'Layer 1' && (
                      <Button
                        size="xs"
                        variant="secondary"
                        className="w-full uppercase"
                        onClick={() => toggleMenuType('bridgeRealms')}
                      >
                        Bridge Realm
                      </Button>
                    )}
                    {RealmStatus(realm) === 'Unsettled L2' && (
                      <Button
                        size="xs"
                        variant="secondary"
                        className="w-full uppercase"
                        onClick={() => toggleMenuType('settleRealms')}
                      >
                        Settle Realm
                      </Button>
                    )}
                  </div>
                )}
                <Button
                  onClick={() => openRealmDetails(realm.realmId)}
                  variant="outline"
                  size="xs"
                  className="w-full "
                >
                  quick view
                </Button>
                <Button
                  onClick={() => {
                    router.push(`/realm/${realm.realmId}?tab=Survey`);
                  }}
                  variant="primary"
                  size="xs"
                  className="w-full "
                >
                  {isYourRealm(realm) ? 'manage' : 'details'}
                </Button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
