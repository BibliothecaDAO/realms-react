import { MouseEventHandler } from "react";
import Left from "../../../public/svg/chevron-left.svg";
type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  onChange: (event: any) => void;
  onSelectChange: (event: any) => void;
  value: number;
  select: string;
};

export const FlyTo = (props: Props) => {
  return (
    <div className="flex absolute bottom-16 sm:top-10 sm:right-36 sm:z-30 sm:w-96 w-full  z-10 text-xl px-4 h-10">
      <input
        placeholder="Type Id"
        type={"number"}
        className="text-black px-4 py-4 rounded-l-xl w-3/12 bg-white/80"
        value={props.value}
        onChange={props.onChange}
        min="1"
        max="8000"
      />
      <button
        className="p-1 px-4 text-off-100 bg-off-200/20 transition-all duration-300 w-4/12 uppercase hover:bg-off-200/60"
        /* @ts-ignore: name not exist on D */
        onClick={() => props.onClick(props.value)}
      >
        Fly to
      </button>

      <select
        className="p-1 px-4 text-off-100 mr-2 bg-off-200/50 transition-all duration-300 rounded-r-xl w-5/12 uppercase font-display cursor-pointer"
        value={props.select}
        /* @ts-ignore: name not exist on D */
        onChange={(event) => props.onSelectChange(event.target.value)}
      >
        <option value={"A"}>Realm</option>
        <option value={"B"}>C&C</option>
      </select>
    </div>
  );
};
