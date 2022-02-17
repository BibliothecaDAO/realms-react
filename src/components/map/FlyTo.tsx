import { MouseEventHandler } from "react";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  onChange: (event: any) => void;
  value: number;
};

export const FlyTo = (props: Props) => {
  return (
    <div className="flex absolute bottom-24 sm:top-10 sm:right-36 sm:z-30 sm:w-96 right-0  z-20 text-xl px-4 h-16 w-full">
      <input
        placeholder="Type Id"
        type={"number"}
        className="text-black px-4 py-4 rounded-l-xl w-1/2 bg-white/80"
        value={props.value}
        onChange={props.onChange}
        min="1"
        max="8000"
      />
      <button
        className="p-1 px-4 text-off-100 mr-2 bg-off-200/20 transition-all duration-300 rounded-r-xl w-1/2 uppercase "
        /* @ts-ignore: name not exist on D */
        onClick={() => props.onClick(props.value)}
      >
        Fly to realm
      </button>
    </div>
  );
};
