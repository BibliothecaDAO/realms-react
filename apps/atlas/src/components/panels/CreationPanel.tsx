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
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LootFilters } from '@/components/filters/LootFilters';
import { LootOverviews } from '@/components/tables/LootOverviews';
import { useLootContext } from '@/context/LootContext';
import { getLootsQuery } from '@/hooks/graphql/queries';
// import { useAtlasContext } from '@/hooks/useAtlas';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { Loot } from '@/types/index';
import { BasePanel } from './BasePanel';
import { PanelHeading } from './PanelComponents/PanelHeading';

const dummyResponse = [
  { img: '/stableai/archanist.png', seed: '1' },
  { img: '/stableai/archanist.png', seed: '2' },
  { img: '/stableai/archanist.png', seed: '3' },
  { img: '/stableai/archanist.png', seed: '4' },
  { img: '/stableai/archanist.png', seed: '5' },
  { img: '/stableai/archanist.png', seed: '6' },
  { img: '/stableai/archanist.png', seed: '7' },
  { img: '/stableai/archanist.png', seed: '8' },
  { img: '/stableai/archanist.png', seed: '9' },
];

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
  const [selectedTraits, setSelectedTraits] = useState<SelectItem[]>([]);

  const [selectedRuler, setSelectedRuler] = useState<ImageResponse>();

  const onSelectedTrait = (value) => {
    const index = selectedTraits.findIndex(
      (id: SelectItem) => id.value === value.value
    );
    if (index !== -1) {
      setSelectedTraits([
        ...selectedTraits.slice(0, index),
        ...selectedTraits.slice(index + 1),
      ]);
    } else {
      setSelectedTraits((current) => [...current, value]);
    }
  };

  return (
    <BasePanel open={true}>
      <div className="grid grid-cols-3 gap-8">
        <div className="p-10 ">
          <h2>Traits</h2>
          <Select
            add={(value) => {
              onSelectedTrait(value);
            }}
            title="sex"
            items={traits.sex}
            selected={selectedTraits}
          />
          <Select
            add={(value) => {
              onSelectedTrait(value);
            }}
            title="hair"
            items={traits.hair}
            selected={selectedTraits}
          />
          <Select
            add={(value) => {
              onSelectedTrait(value);
            }}
            title="race"
            items={traits.race}
            selected={selectedTraits}
          />
          <Select
            add={(value) => {
              onSelectedTrait(value);
            }}
            title="patterns"
            items={traits.patterns}
            selected={selectedTraits}
          />
          <div className="flex w-full">
            <Button className="w-full" variant="primary" size="lg">
              summon ruler
            </Button>
          </div>
        </div>
        <div className="p-10 ">
          <h1 className="mb-3">Your Ruler</h1>
          <div className="border card">
            {selectedRuler && (
              <Image
                width={500}
                height={500}
                className={'w-72 h-72 mx-auto'}
                src={selectedRuler?.img}
              />
            )}
            <h4>seed: {selectedRuler && selectedRuler.seed}</h4>
          </div>

          <div className="flex w-full">
            <Button className="w-full" variant="primary" size="lg">
              hire ruler
            </Button>
          </div>
          {selectedTraits.map((a, i) => {
            return (
              <SelectButton
                key={i}
                value={a.value}
                title={a.title}
                add={(value) => {
                  onSelectedTrait(value);
                }}
              />
            );
          })}
        </div>
        <div className="p-10 ">
          <h3>Potentials candidates</h3>
          <div className="grid grid-cols-3 gap-2">
            {dummyResponse.map((a, i) => {
              return (
                <Image
                  key={i}
                  width={200}
                  height={200}
                  className={'w-32 h-32 mx-auto rounded-full hover:opacity-50'}
                  src={a.img}
                  onClick={() => setSelectedRuler(a)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </BasePanel>
  );
};
