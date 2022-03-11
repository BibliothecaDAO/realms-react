import { useEffect, useState } from 'react';
import ga_bags from '@/geodata/ga_bags.json';

type Props = {
  onClick: (event: any, id: string) => void;
  onChange: (event: any) => void;
  onSelectChange: (event: any) => void;
  value: number;
  select: string;
};

export const FlyTo = (props: Props) => {
  const [maxID, setMaxID] = useState('8000');

  useEffect(() => {
    switch (props.select) {
      case 'B':
        return setMaxID('9000');
      case 'D':
        return setMaxID(
          Math.max(
            ...ga_bags.features.map((feature) =>
              parseInt(feature.properties.ga_id)
            )
          ).toString()
        );
      default:
        return setMaxID('8000');
    }
  }, [props.select]);
  return (
    <div className="absolute z-10 flex w-full h-10 px-4 text-xl bottom-16 sm:top-10 sm:right-36 sm:z-30 sm:w-96">
      <input
        placeholder="Type Id"
        type={'number'}
        className="w-3/12 px-4 py-4 text-black rounded-l-xl bg-white/80"
        value={props.value}
        onChange={props.onChange}
        min="1"
        max={maxID}
      />
      <button
        className="w-4/12 p-1 px-4 uppercase transition-all duration-300 text-off-100 bg-off-200/20 hover:bg-off-200/60"
        onClick={() => props.onClick(props.value, props.select)}
      >
        Fly to
      </button>

      <select
        className="w-5/12 p-1 px-4 mr-2 uppercase transition-all duration-300 cursor-pointer text-off-100 bg-off-200/50 rounded-r-xl font-display"
        value={props.select}
        onChange={(event) => props.onSelectChange(event.target.value)}
      >
        <option value={'A'}>Realm</option>
        <option value={'B'}>C&C</option>
        <option value={'C'}>Loot</option>
        <option value={'D'}>GA</option>
      </select>
    </div>
  );
};
