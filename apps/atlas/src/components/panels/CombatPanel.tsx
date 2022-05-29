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
          <RealmBannerHeading order="the fox" title="Smutmum" />
        </div>
        <div className="col-start-7 col-end-9 p-8 rounded bg-white/60">
          <div className="text-2xl font-lords">battle report</div>
        </div>
      </div>
    </BasePanel>
  );
}
