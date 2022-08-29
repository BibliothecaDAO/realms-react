import Image from 'next/image';
import type { ReactElement } from 'react';

interface Props {
  children?: React.ReactNode;
  timeStamp: string;
  event: any;
  action: string | ReactElement;
  eventId?: string | null;
}

export const HistoryCard = (props: Props) => {
  return (
    <div
      className={`flex flex-wrap mb-2 justify-between border border-white/10 rounded-xl p-6 bg-black/80 w-full relative`}
    >
      <Image
        objectFit="cover"
        className="brightness-75 contrast-75 "
        layout="fill"
        src={`https://ingave-images.s3.eu-west-3.amazonaws.com/37a7186b-${props.eventId}.png`}
        alt=""
      />
      <div className="z-10 justify-between w-full">
        <div className="text-sm font-semibold text-stone-100/40">
          {new Date(props.timeStamp).toLocaleTimeString('en-US')}{' '}
          {new Date(props.timeStamp).toLocaleDateString('en-US')}
        </div>
        <h3> {props.event}</h3>

        {props.children}
      </div>
      <div className="pt-5">{props.action}</div>
    </div>
  );
};
