import Image from 'next/image';
import type { ReactElement } from 'react';

interface Props {
  children?: React.ReactNode;
  timeStamp: string;
  event: string | ReactElement;
  action: string | ReactElement;
}

export const HistoryCard = (props: Props) => {
  return (
    <div
      className={`flex flex-wrap mb-2 justify-between border border-white/10 rounded-xl p-6 bg-black/80 w-full`}
    >
      <div className="justify-between w-full">
        {/* <img src={`https://ingave-images.s3.eu-west-3.amazonaws.com/37a7186b-${props.}.png`} alt="" /> */}
        <div className="text-sm font-semibold text-stone-300/40">
          {new Date(props.timeStamp).toLocaleTimeString('en-US')}{' '}
          {new Date(props.timeStamp).toLocaleDateString('en-US')}
        </div>
        <h3 className="">{props.event}</h3>
      </div>
      {props.children}
      <div className="pt-5">{props.action}</div>
    </div>
  );
};
