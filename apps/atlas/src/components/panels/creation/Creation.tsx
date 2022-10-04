import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CountdownTimer,
  InputNumber,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';
import { useStarknet } from '@starknet-react/core';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const projectID = 'test_rulers';

const traits = {
  sex: [
    { title: 'male', value: 'male' },
    { title: 'female', value: 'female' },
    { title: 'n/a', value: 'no sex' },
  ],
  hair: [
    { title: 'blonde', value: 'blonde hair' },
    { title: 'black', value: 'black hair' },
    { title: 'red', value: 'red hair' },
    { title: 'none', value: 'none' },
  ],
  eyes: [
    { title: 'blue', value: 'blue eyes' },
    { title: 'red', value: 'red eyes' },
    { title: 'black', value: 'black eyes' },
    { title: 'yellow', value: 'yellow eyes' },
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

export const Creation = () => {
  const { account } = useStarknet();
  const [selectedTraits, setSelectedTraits] = useState<SelectItem[]>([]);
  const [rulers, setRulers] = useState<ImageResponse[]>();

  const [selectedRuler, setSelectedRuler] = useState<ImageResponse>();
  const [loading, setLoading] = useState(false);

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
  const url =
    'https://2e12-2a02-1811-3780-3800-43b8-68b1-88af-118f.eu.ngrok.io/generateImages';

  const prompt = () => {
    const one = 'symmetry! portrait of young';
    const end =
      ',fantasy, dune, greg rutkowski, highly detailed, digital painting, trending on artstation, concept art, sharp focus, illustration, global illumination, ray tracing, realistic shaded, art by artgerm';

    const sauce = selectedTraits
      .map((a) => {
        return a.value;
      })
      .join()
      .split(',');

    return one + sauce + end;
  };

  const fetchPlayers = async () => {
    setLoading(true);
    const params = {
      project: projectID,
      user: account,
      collection: 'first_collection',
    };

    const body = {
      generation_settings: {
        prompt: prompt(),
        n_images: 9,
        steps: 32,
        height: 512,
        width: 512,
      },
    };
    const res = await axios.post(url, body, { params });

    const obj: ImageResponse[] = res.data.map((a) => {
      return { img: a.uri, seed: 1 };
    });

    setRulers(obj);

    setLoading(false);
  };
  return (
    <div>
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
            title="eyes"
            items={traits.eyes}
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
            <Button
              onClick={() => fetchPlayers()}
              className="w-full"
              variant="primary"
              size="lg"
            >
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
              {loading ? 'loading' : 'hire ruler'}
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
            {rulers?.map((a, i) => {
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
    </div>
  );
};
