import { useQuery } from '@apollo/client';
import { Tabs } from '@bibliotheca-dao/ui-lib';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CountdownTimer,
  InputNumber,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { useStarknet } from '@starknet-react/core';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LootFilters } from '@/components/filters/LootFilters';
import { LootOverviews } from '@/components/tables/LootOverviews';
import { useLootContext } from '@/context/LootContext';
import { getLootsQuery } from '@/hooks/graphql/queries';
// import { useAtlasContext } from '@/hooks/useAtlas';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { Loot } from '@/types/index';
import { BasePanel } from './BasePanel';
import { AllCreations } from './creation/AllCreations';
import { Creation } from './creation/Creation';
import { MyCreations } from './creation/MyCreations';
import { PanelHeading } from './PanelComponents/PanelHeading';

const projectID = 'test_rulers';

const traits = {
  sex: [
    { title: 'male', value: 'male' },
    { title: 'female', value: 'female' },
    { title: 'n/a', value: 'no sex' },
  ],
  hair: [
    { title: 'blonde', value: 'blonde' },
    { title: 'black', value: 'black' },
    { title: 'red', value: 'red' },
    { title: 'none', value: 'none' },
  ],
  eyes: [
    { title: 'blue', value: 'blue' },
    { title: 'red', value: 'red' },
    { title: 'black', value: 'black' },
    { title: 'yellow', value: 'yellow' },
  ],
  race: [
    { title: 'Human', value: 'human' },
    { title: 'Orc', value: 'orc' },
    { title: 'Demon', value: 'demon' },
    { title: 'Unknown', value: 'unknown' }, // could have random list on this
    { title: 'Cat', value: 'cat' },
    { title: 'Frog', value: 'frog' },
  ],
  patterns: [
    { title: 'Arabic', value: 'arabic patterns' },
    { title: 'Chinese', value: 'oriential chiense patterns' },
    { title: 'Australian', value: 'australian patterns' },
  ],
};

interface ImageResponse {
  img: string;
  seed: string;
}

interface SelectItem {
  title: string;
  value: string;
}

interface SelectButton {
  add?: (id) => void;
  active?: boolean;
}

interface SelectProps {
  title?: string;
  items: SelectItem[];
  add?: (id) => void;
  selected: SelectItem[];
}

export const SelectButton = (props: SelectItem & SelectButton) => {
  return (
    <button
      onClick={() => props.add?.({ title: props.title, value: props.value })}
      className={`w-auto p-4 uppercase border card font-display hover:bg-cta-100 ${
        props.active && 'bg-cta-100'
      }`}
    >
      {props.title}
    </button>
  );
};

export const Select = (props: SelectProps) => {
  return (
    <div>
      <h3 className="self-center mr-4">{props.title}</h3>
      <div className="flex flex-wrap my-3">
        {props.items.map((a, i) => {
          const active =
            props.selected.filter((b) => b.value == a.value).length > 0
              ? true
              : false;
          return (
            <SelectButton
              key={i}
              active={active}
              value={a.value}
              title={a.title}
              add={props.add}
            />
          );
        })}
      </div>
    </div>
  );
};

export const CreationPanel = () => {
  const { play } = useUiSounds(soundSelector.pageTurn);
  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = useMemo(
    () => [
      {
        label: (
          <div className="flex">
            <div className="hidden md:block">Summon</div>
          </div>
        ),
        component: <Creation />,
      },
      {
        label: (
          <div className="flex">
            <div className="hidden md:block">My Rulers</div>
          </div>
        ),
        component: <MyCreations />,
      },
      {
        label: (
          <div className="flex">
            <div className="hidden md:block">All</div>
          </div>
        ),
        component: <AllCreations />,
      },
    ],
    [selectedTab]
  );

  return (
    <BasePanel open={true}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="default"
      >
        <div className="w-full overflow-y-auto bg-black border-t pt-14 sm:pt-0 border-white/20">
          <Tabs.List className="">
            {tabs.map((tab, index) => (
              <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
            ))}
          </Tabs.List>
        </div>
        <Tabs.Panels>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </BasePanel>
  );
};