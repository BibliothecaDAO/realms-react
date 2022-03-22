import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib';
import { useUIContext } from '@/hooks/useUIContext';
import { ResourceIcon } from '@/shared/ResourceIcon';

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

  const openRealmDetails = () => {
    setSelectedId(testRealm.id.toString());
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
      <div className="flex w-full h-auto max-w-full overflow-x-scroll border border-gray-500 border-double rounded shadow-md justify-evenly">
        <div className="flex w-full p-8 text-gray-800 rounded-l bg-white/70">
          <OrderIcon
            className="self-center"
            size={'md'}
            order={testRealm.order}
          />
          <div className="self-center pl-6">
            <h5 className="text-gray-400">{testRealm.id}</h5>
            <h2 className="mb-3">{testRealm.name}</h2>
          </div>
        </div>
        <div className="w-full p-6 bg-black/70">
          {testRealm.resources.map((a, index) => {
            return (
              <div className="flex my-4 font-bold " key={index}>
                <ResourceIcon size="sm" resource={a} />{' '}
                <span className="ml-4 uppercase tracking-veryWide">{a}</span>
                <span className="self-end px-4 ml-auto uppercase tracking-veryWide">
                  100
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full p-8 bg-gray-800/70">
          {' '}
          {testRealm.statistics.map((a, index) => {
            return (
              <div className="flex my-4 font-bold " key={index}>
                <span className="ml-4 uppercase tracking-veryWide">{a}</span>
                <span className="self-end px-4 ml-auto uppercase tracking-veryWide">
                  100
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
            onClick={() => openRealmDetails()}
            variant="default"
            className="w-full uppercase"
          >
            details
          </Button>
        </div>
      </div>
    </div>
  );
}
