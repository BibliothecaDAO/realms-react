import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';

export function SwapResources(): ReactElement {
  return (
    <div className="flex flex-col">
      <div className="flex p-2 bg-gray-800/70">
        <div className="sm:w-1/2">
          <select className="w-full" name="Select Resource">
            <option value="wood">Wood</option>
          </select>
          <div className="flex justify-between text-sm">
            <div>Max: 900</div>
            <div>1 = 1.01</div>
          </div>
        </div>
        <div className="text-right sm:w-1/2">10.1</div>
      </div>
      <div className="flex justify-end w-full pt-4">
        <Button className="w-full" variant="primary">
          Trade
        </Button>
      </div>
    </div>
  );
}
