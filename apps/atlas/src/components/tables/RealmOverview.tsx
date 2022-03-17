import { Button } from '@bibliotheca-dao/ui-lib';
export function RealmOverview() {
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
      <div className="flex w-full h-40 text-center shadow-lg justify-evenly">
        <div className="w-full p-8 text-gray-800 bg-white/70">Realm Name</div>
        <div className="w-full p-8 bg-black/70">Resources</div>
        <div className="w-full p-8 bg-gray-800/70">Statistics</div>
        <div className="w-full p-8 bg-gray-700/70">Raiding</div>
        <div className="w-full p-8 bg-gray-600/70">Actions</div>
      </div>
    </div>
  );
}
