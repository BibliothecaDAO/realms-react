import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import TokenLabel from '../ElementsLabel';
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
    'text-blue-600 hover:text-blue-500 py-2 disabled:text-gray-800';

  return (
    <div className="block p-8">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1>Lore</h1>
      </div>
      <button
        disabled={layerIndex == 0}
        onClick={() => {
          goToParentLore();
        }}
        className={loreBtnClass}
      >
        {' '}
        <ArrowUpIcon className="inline-block h-4" /> What Lore came before?
      </button>
      <h2 className="mb-2">{currentLayer.title}</h2>

      {currentLayer.descriptions.map((d, i) => (
        <p className="my-2 text-xl" key={i}>
          {d}
        </p>
      ))}
      <button
        disabled={layerIndex == ldk.layers.length - 1}
        onClick={() => goToLoreBranches()}
        className={loreBtnClass}
      >
        {' '}
        <ArrowDownIcon className="inline-block h-4" /> What Lore comes after?
      </button>
    </div>
  );
};

export default LoreDevKit;
