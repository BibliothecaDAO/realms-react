import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import Button from '../Button';
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
    'text-blue-600 hover:text-blue-300 py-2 disabled:text-gray-800 my-4';

  return (
    <div className="block p-8">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1>Lore</h1>
      </div>
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
      <h2 className="mt-8">{currentLayer.title}</h2>

      {currentLayer.descriptions.map((d, i) => (
        <p className="my-8 text-2xl" key={i}>
          {d}
        </p>
      ))}
      <Button
        disabled={layerIndex == ldk.layers.length - 1}
        onClick={() => goToLoreBranches()}
        className={loreBtnClass}
      >
        {' '}
        <ArrowDownIcon className="inline-block h-4" /> What Lore comes after?
      </Button>
    </div>
  );
};

export default LoreDevKit;
