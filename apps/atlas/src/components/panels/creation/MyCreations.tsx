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

export const MyCreations = () => {
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

  const fetchPlayers = async () => {
    setLoading(true);
    const params = {
      project: projectID,
      user: account,
      collection: 'first_collection',
    };
    const traits = {
      eyes: 'black',
      pattern: 'chinese',
    };
    const body = {
      generation_settings: {
        prompt:
          'symmetry! portrait of female mage, blonde hair, fantasy, dune, greg rutkowski, highly detailed, digital painting, trending on artstation, concept art, sharp focus, illustration, global illumination, ray tracing, realistic shaded, art by artgerm',
        n_images: 9,
        steps: 32,
        seed: -1,
        cfg_scale: 7.5,
        height: 512,
        width: 512,
      },
      traits: traits,
    };
    const res = await axios.post(url, body, { params });

    const obj: ImageResponse[] = res.data.map((a) => {
      return { img: a.uri, seed: 1 };
    });

    setRulers(obj);

    console.log(obj);
    setLoading(false);
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-8">
        <div className="p-10 ">
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
