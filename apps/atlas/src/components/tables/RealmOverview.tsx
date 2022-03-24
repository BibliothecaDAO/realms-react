import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';

export function RealmOverview() {
  const testRealm = {
    name: 'Smutmum',
    order: 'anger',
    id: 1,
    resources: ['Wood', 'DragonHide', 'Coal', 'Ruby', 'Copper'],
    statistics: ['Happiness', 'Culture', 'Food', 'Population'],
    military: ['Offence', 'Defence', 'Last Attacked'],
  };
  const { toggleMenuType, selectedMenuType, setSelectedId } = useUIContext();

  const { account, isConnected, displayName } = useWalletContext();

  const { data } = useGetRealmsQuery({
    /* variables: {
      address: account.toLowerCase(), // value for 'id'
    }, */
  });

  const openRealmDetails = (realmId: number) => {
    setSelectedId(realmId.toString());
    if (selectedMenuType !== 'realm') {
      toggleMenuType('realm');
    }
  };
  return (
    <div>
      <div className="flex justify-between">
        <div>Search</div>
        <div className="flex mb-4">
          <Button variant="primary" className="px-4 ml-2 uppercase">
            Resources
          </Button>
          <Button variant="primary" className="px-4 ml-2 uppercase">
            Rarity
          </Button>
          <Button variant="primary" className="px-4 ml-2 uppercase">
            Orders
          </Button>
          <Button variant="primary" className="px-4 ml-2 uppercase">
            Traits
          </Button>
        </div>
      </div>
      {data &&
        data.getRealms
          .slice(0, 10)
          .map((realm: RealmFragmentFragment, index) => (
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
