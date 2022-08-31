import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import type { ReactElement } from 'react';
import { useGetRealmQuery } from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { BasePanel } from './BasePanel';

export function NoticeBoard(): ReactElement {
  const { togglePanelType, selectedPanel } = useAtlasContext();

  const { data } = useGetRealmQuery({
    variables: {
      id: 1, // value for 'id'
    },
  });
  return (
    <BasePanel open={selectedPanel === 'noticeBoard'} style="lg:w-12/12">
      <div className="flex justify-between p-10">
        <h1>Leaders on the Realms</h1>
        <div>
          <Button
            variant="secondary"
            onClick={() => togglePanelType('noticeBoard')}
          >
            <Close />
          </Button>
        </div>
      </div>
    </BasePanel>
  );
}
