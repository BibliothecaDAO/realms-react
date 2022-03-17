import { Button } from '@bibliotheca-dao/ui-lib';
import { OrderIcon } from '@/shared/OrderIcon';
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
      <div className="flex w-full h-auto shadow-md justify-evenly border border-gray-500 rounded border-double">
        <div className="w-full p-8 text-gray-800 bg-white/70 flex   rounded-l">
          <OrderIcon
            className="self-center"
            size={'md'}
            order={testRealm.order}
          />
          <div className="pl-6 self-center">
            <h5 className="text-gray-400">{testRealm.id}</h5>
            <h2 className="mb-3">{testRealm.name}</h2>
          </div>
        </div>
        <div className="w-full p-6 bg-black/70">
          {testRealm.resources.map((a, index) => {
            return (
              <div className="my-4 flex font-bold " key={index}>
                <ResourceIcon size="sm" resource={a} />{' '}
                <span className="ml-4 uppercase tracking-veryWide">{a}</span>
                <span className="uppercase tracking-veryWide self-end ml-auto px-4">
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
              <div className="my-4 flex font-bold " key={index}>
                <span className="ml-4 uppercase tracking-veryWide">{a}</span>
                <span className="uppercase tracking-veryWide self-end ml-auto px-4">
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
              <div className="my-4 flex font-bold " key={index}>
                <span className="uppercase tracking-veryWide">{a}</span>
                <span className="uppercase tracking-veryWide self-end ml-auto px-4">
                  100
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full p-8 bg-gray-600/70 flex flex-col justify-center space-y-3">
          {' '}
          <Button variant="default" className="uppercase w-full">
            fly to
          </Button>
          <Button variant="default" className="uppercase w-full">
            details
          </Button>
        </div>
      </div>
    </div>
  );
}
