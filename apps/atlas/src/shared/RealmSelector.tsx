import { Button, Card, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import { useState } from 'react';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { TroopSlot } from '@/constants/troops';
import type { GetRealmsQuery } from '@/generated/graphql';
import useMySettledRealms from '@/hooks/settling/useMySettledRealms';
import SidebarHeader from './SidebarHeader';
import SquadStatistics from './squad/SquadStatistics';

type Props = {
  onSelect: (selected: GetRealmsQuery['realms']) => void;
};

const RealmSelector = (props: Props) => {
  const realms = useMySettledRealms({ pageSize: 10 });
  const [selectedRealms, setSelectedRealms] = useState<
    GetRealmsQuery['realms']
  >([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full">
      <Button
        onClick={() => setSidebarOpen(true)}
        className="w-full my-4"
        variant={selectedRealms.length ? 'outline' : 'primary'}
      >
        {selectedRealms.length == 0
          ? 'Select Realm'
          : 'selected:' + selectedRealms[0].name}
      </Button>

      <AtlasSidebar isOpen={sidebarOpen}>
        <SidebarHeader
          title="Select Realm"
          onClose={() => setSidebarOpen(false)}
        ></SidebarHeader>
        <div className="grid grid-cols-12 gap-4">
          {realms.data &&
            !realms.loading &&
            realms.data.realms.map((r) => (
              <Card className="col-span-12 md:col-span-6" key={r.realmId}>
                <div className="flex">
                  <OrderIcon
                    className="self-center"
                    size="sm"
                    order={r.orderType}
                  />
                  <h3 className="ml-3">
                    {' '}
                    {r.name} | {r.realmId}
                  </h3>
                </div>
                <div className="pt-2">
                  <SquadStatistics
                    slot={TroopSlot.attacking}
                    troops={r.troops || []}
                  />
                </div>

                <div className="w-full mt-2">
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full"
                    onClick={() => {
                      setSidebarOpen(false);
                      setSelectedRealms([r]);
                      props.onSelect([r]);
                    }}
                  >
                    to battle
                  </Button>
                </div>
              </Card>
            ))}
        </div>
        <Button
          onClick={() => {
            realms.hasNext ? realms.loadNext() : realms.reset();
          }}
          className="w-full mt-4"
        >
          {realms.hasNext ? 'Load More' : 'Back to First Page'}
        </Button>
      </AtlasSidebar>
    </div>
  );
};

export default RealmSelector;
