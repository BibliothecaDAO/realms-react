/* eslint-disable no-irregular-whitespace */
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import Button from '../Button';
import { ExternalLink } from '../Icons';
import type { LDKSchema } from './lib';

type Prop = {
  ldk: LDKSchema;
  initialLayer?: string;
};

const LoreDevKit = (props: Prop) => {
  const { ldk } = props;

  const initLayerIndex = ldk.layers
    .map((l) => l.title)
    .indexOf(props.initialLayer || '');

  const [layerIndex, setLayerIndex] = useState(
    initLayerIndex == -1 ? 0 : initLayerIndex
  );

  const currentLayer = ldk.layers[layerIndex];

  const goToParentLore = () => {
    if (layerIndex > 0) {
      setLayerIndex((prev) => prev - 1);
    }
  };

  const goToLoreBranches = () => {
    if (layerIndex < props.ldk.layers.length - 1) {
      setLayerIndex((prev) => prev + 1);
    }
  };

  const loreBtnClass =
    'text-blue-600 hover:text-blue-300 py-2 disabled:text-gray-800 my-4';

  return (
    <div className="block">
      <Button
        disabled={layerIndex == 0}
        onClick={() => {
          goToParentLore();
        }}
        className={loreBtnClass}
      >
        {' '}
        <ArrowUpIcon className="inline-block h-4" /> What Lore came before?
      </Button>
      <h3 className="">
        {currentLayer.title}{' '}
        {currentLayer.end ? (
          <span className="px-2 py-1 text-sm bg-black rounded-md">
            Lore Extension Prompt
          </span>
        ) : null}
      </h3>
      <div className="text-lg">
        {currentLayer.descriptions.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <Button
        disabled={layerIndex == ldk.layers.length - 1}
        onClick={() => goToLoreBranches()}
        className={loreBtnClass}
      >
        {' '}
        <ArrowDownIcon className="inline-block h-4" /> What Lore comes after?
      </Button>
      {currentLayer.end ? (
        <div className="p-4 bg-gray-900 rounded-xl">
          <h3>Loot is an experiment in decentralized world building.</h3>
          Loot is unique — there is no central team, no central roadmap, no
          company that backs it. Loot is a decentralized community of builders,
          creators, artists, writers and players who are building a world,
          together. The collection of projects that have been built on top of
          Loot have come to be known collectively as "The Lootverse."
          <a
            target={'_blank'}
            href="https://docs.loot.foundation/welcome-to-loot/the-lootverse#an-experiment-in-decentralized-world-building"
            className="block w-full py-2"
            rel="noreferrer"
          >
            Read more at docs.loot.foundation{' '}
            <ExternalLink className="inline-block w-4" />
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default LoreDevKit;
