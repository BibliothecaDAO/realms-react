import type { ReactElement } from 'react';
import { useGetRealmQuery } from '@/generated/graphql';

import { BasePanel } from './BasePanel';

export function NoticeBoard(): ReactElement {
  const { data } = useGetRealmQuery({
    variables: {
      id: 1, // value for 'id'
    },
  });
  return (
    <BasePanel open={false} style="lg:w-12/12">
      <div className="flex justify-between p-10">
        <h1>Leaders on the Realms</h1>
        {/* <div>
          <Button
            variant="secondary"
            onClick={() => togglePanelType('noticeBoard')}
          >
            <Close />
          </Button>
        </div> */}
      </div>
    </BasePanel>
  );
}
