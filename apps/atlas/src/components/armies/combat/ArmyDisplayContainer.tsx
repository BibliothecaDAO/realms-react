import { OrderIcon, Tabs } from '@bibliotheca-dao/ui-lib/base';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import { useMemo, useState } from 'react';
import { fetchRealmNameById } from '@/components/realms/RealmsGetters';
import { nameArray, useArmy } from '@/hooks/settling/useArmy';
import { ArmyBattalions } from '../armyCard/ArmyBattalions';
import { ArmyStatisticsTable } from '../armyCard/ArmyStatisticsTable';
import { BattalionWithImage } from '../squad/BattalionWithImage';

export const ArmyDisplayContainer = ({ order, realmId, army, owner }) => {
  const { battalions } = useArmy();
  const [selectedTab, setSelectedTab] = useState(0);

  const pressedTab = (index) => {
    setSelectedTab(index as number);
  };

  const tabs = useMemo(
    () => [
      {
        label: <Map className="self-center w-3 h-3 fill-current" />,
        component: <ArmyStatisticsTable army={army} />,
      },
      {
        label: <Head className="self-center w-3 h-3 fill-current" />,
        component: <ArmyBattalions army={army} />,
      },
    ],
    [army]
  );

  return (
    <div>
      <div className="">
        <div className="flex justify-start w-full py-4 text-3xl text-center border-4 border-yellow-900 border-double bg-gray-1000 rounded-t-2xl">
          {/* <span>{starknetId}</span> */}
          <OrderIcon
            containerClassName="inline-block mx-4"
            size="md"
            order={order || ''}
          />{' '}
          <span className="self-center">{fetchRealmNameById(realmId)}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 p-4 border-4 border-yellow-900 border-double bg-gray-1000 rounded-b-2xl">
          {battalions?.map((battalion, index) => {
            return (
              <>
                {army && army[nameArray[index] + 'Qty'] > 0 && (
                  <BattalionWithImage
                    key={index}
                    {...battalion}
                    quantity={army ? army[nameArray[index] + 'Qty'] : ''}
                    health={army ? army[nameArray[index] + 'Health'] : ''}
                  />
                )}
              </>
            );
          })}
        </div>
        <div className="w-full p-4 mt-3 border-4 border-yellow-900 border-double bg-gray-1000 rounded-2xl">
          <Tabs
            selectedIndex={selectedTab}
            onChange={(index) => pressedTab(index as number)}
            variant="small"
          >
            <Tabs.List className="">
              {tabs.map((tab, index) => (
                <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
              ))}
            </Tabs.List>

            <Tabs.Panels>
              {tabs.map((tab, index) => (
                <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
              ))}
            </Tabs.Panels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
