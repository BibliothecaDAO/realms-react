import { Card } from '@bibliotheca-dao/ui-lib/base';
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
      className={`flex flex-wrap mb-2 justify-between w-full relative border border-yellow-900 rounded p-3 shadow-red-900/80 shadow-2xl`}
    >
      {/* <Image
        objectFit="cover"
        className="rounded-xl brightness-50 contrast-75 "
        layout="fill"
        src={`https://ingave-images.s3.eu-west-3.amazonaws.com/37a7186b-${props.eventId}.png`}
        alt=""
      /> */}
      <div className="z-10 justify-between w-full">
        <div className=" flex justify-between">
          <h3> {props.event}</h3>
          <span className="text-xs text-gray-700">
            {' '}
            {new Date(props.timeStamp).toLocaleTimeString('en-US')}
            {' | '}
            {new Date(props.timeStamp).toLocaleDateString('en-US')}
          </span>
        </div>

        {props.children}
        {props.action && <div className="pt-5">{props.action}</div>}
      </div>
    </div>
  );
};
