import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import { useState } from 'react';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import type { GetRealmsQuery } from '@/generated/graphql';
import useRealms from '@/hooks/settling/useRealms';
import SidebarHeader from './SidebarHeader';

type Props = {
  onSelect: (selected: GetRealmsQuery['realms']) => void;
};

const RealmSelector = (props: Props) => {
  const realms = useRealms();
  const [selectedRealms, setSelectedRealms] = useState<
    GetRealmsQuery['realms']
  >([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full">
      <Button
        onClick={() => setSidebarOpen(true)}
        className="w-full my-2"
        variant="secondary"
      >
        {selectedRealms.length == 0 ? 'Select Realm' : selectedRealms[0].name}
      </Button>

      <AtlasSidebar isOpen={sidebarOpen}>
        <SidebarHeader
          title="Select Realm"
          onClose={() => setSidebarOpen(false)}
        ></SidebarHeader>
        {realms.data &&
          !realms.loading &&
          realms.data.realms.map((r) => (
            <button
              onClick={() => {
                setSidebarOpen(false);
                setSelectedRealms([r]);
                props.onSelect([r]);
              }}
              className="w-full p-4 border hover:bg-gray-500"
              key={r.realmId}
            >
              <OrderIcon size="sm" order={r.orderType} /> {r.name}
            </button>
          ))}
      </AtlasSidebar>
    </div>
  );
};

export default RealmSelector;
