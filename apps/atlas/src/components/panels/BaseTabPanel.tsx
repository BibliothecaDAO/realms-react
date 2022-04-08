import { Tabs } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
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
  selectedIndex: number;
  onChange: (idx: number) => void;
}

export const BaseTabPanel = ({
  tabs,
  panelName,
  panelType,
  selectedIndex,
  onChange,
}: BaseTabPanelProps) => {
  const { togglePanelType, selectedPanel } = useUIContext();

  return (
    <BasePanel open={selectedPanel === panelType}>
      <div className="flex justify-between pt-2">
        <div className="sm:hidden"></div>
        <h1>{panelName}</h1>

        <button
          className="z-50 transition-all rounded sm:hidden top-4"
          onClick={() => togglePanelType(panelType)}
        >
          <Close />
        </button>
      </div>
      <Tabs selectedIndex={selectedIndex} onChange={onChange as any}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.label} className="uppercase">
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels className="mt-2">
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </BasePanel>
  );
};
