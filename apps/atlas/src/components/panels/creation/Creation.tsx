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
import {
  projectID,
  stableDiffusionEndPoints,
  stableDiffusionUrl,
  traits,
} from '@/constants/character';
import type {
  ImageResponse,
  SelectButton,
  SelectItem,
  SelectProps,
} from '@/types/index';

export const OptionSelect = (props: SelectItem & SelectButton) => {
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
            <OptionSelect
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

  const prompt = () => {
    const one = 'symmetry! portrait of young ';
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

    const body = {
      project: projectID,
      user: account,
      collection: 'first_collection',
      generation_settings: {
        prompt: prompt(),
        n_images: 9,
        steps: 32,
        height: 512,
        width: 512,
      },
    };
    const res = await axios.post(
      stableDiffusionUrl + stableDiffusionEndPoints.generate,
      body
    );

    console.log(res);

    const obj: ImageResponse[] = res.data.map((a) => {
      return { img: a.uri, seed: a.seed };
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
            title="occupation"
            items={traits.occupation}
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
          <h1 className="mb-3 mb-20 text-center">Your Ruler</h1>
          <div className="border card">
            {selectedRuler && (
              <Image
                width={500}
                layout={'responsive'}
                height={500}
                className={'w-72 h-72 mx-auto'}
                src={selectedRuler?.img}
              />
            )}
            {/* <h4>seed: {selectedRuler && selectedRuler.seed}</h4> */}
          </div>

          <div className="flex w-full">
            <Button className="w-full" variant="primary" size="lg">
              {loading ? 'loading' : 'hire ruler'}
            </Button>
          </div>
          {selectedTraits.map((a, i) => {
            return (
              <OptionSelect
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
          <h2 className="mb-20 text-center ">Potentials candidates</h2>
          <div className="grid grid-cols-3 gap-4">
            {rulers?.map((a, i) => {
              return (
                <Image
                  key={i}
                  width={200}
                  height={200}
                  layout={'responsive'}
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
