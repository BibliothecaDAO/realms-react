import { Tabs } from '@bibliotheca-dao/ui-lib';
import type { PanelType } from '@/hooks/useUIContext';
import { useUIContext } from '@/hooks/useUIContext';
import { BasePanel } from './BasePanel';

interface BaseTabPanelProps {
  panelName: string;
  panelType: PanelType;
  tabs: {
    label: string;
    icon: JSX.Element;
    component: JSX.Element;
  }[];
}

export const BaseTabPanel = ({
  tabs,
  panelName,
  panelType,
}: BaseTabPanelProps) => {
  const { togglePanelType, selectedPanel } = useUIContext();

  return (
    <BasePanel open={selectedPanel === panelType}>
      <div className="flex justify-between">
        <div className="sm:hidden"></div>
        <h1 className="tex">{panelName}</h1>
        <button
          className="p-4 mb-8 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={() => togglePanelType(panelType)}
        >
          CLOSE
        </button>
      </div>
      <Tabs>
        <Tabs.List className="ml-8">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.label} className="uppercase">
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels className="mt-8">
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </BasePanel>
  );
};
