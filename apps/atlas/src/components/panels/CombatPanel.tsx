import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import type { ReactElement } from 'react';
import { useUIContext } from '@/hooks/useUIContext';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
import { dummySquad } from '@/shared/squad/DummySquad';
import { SquadBuilder } from '@/shared/squad/Squad';
import { BasePanel } from './BasePanel';
export function CombatPanel(): ReactElement {
  const { togglePanelType, selectedPanel } = useUIContext();

  return (
    <BasePanel open={selectedPanel === 'combat'}>
      <div className="flex justify-between">
        <div>
          <Button variant="secondary" onClick={() => togglePanelType('combat')}>
            <Close />
          </Button>
        </div>
      </div>
      <div className="relative grid h-full grid-cols-8 gap-4">
        <div className="flex flex-col justify-between h-full col-start-1 col-end-7">
          <RealmBannerHeading order="the fox" title="Smutmum" />
          <SquadBuilder flipped={true} troops={dummySquad} />
          <Button variant="primary">Attack</Button>
          <SquadBuilder troops={dummySquad} />
          <RealmBannerHeading order="power" title="Smutmum" />
        </div>
        <div className="col-start-7 col-end-9 px-4 py-4 bg-white rounded">
          <div className="mb-4 text-3xl text-center text-gray-500 font-lords">
            battle report
          </div>
          <div className="flex flex-wrap">
            <div className="w-full px-4 py-3 my-1 uppercase bg-gray-500 rounded shadow-inner">
              {' '}
              Realm 1 hit points 20
            </div>
            <div className="w-full px-4 py-3 my-1 uppercase bg-gray-500 rounded shadow-inner">
              {' '}
              attack
            </div>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
