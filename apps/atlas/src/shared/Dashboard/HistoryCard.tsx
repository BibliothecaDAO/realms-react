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
      <div className="z-10 w-full flex flex-wrap">
        <div className="flex">
          <img
            className="rounded-full w-24 h-24 mr-8"
            src={`/vizirs/mj_builder.png`}
            alt=""
          />
          <div className="flex-auto">
            <div className=" flex justify-between">
              <span className="text-xl"> {props.event}</span>
            </div>

            {props.children}
            {props.action && <div className="mt-2">{props.action}</div>}
          </div>
        </div>

        <div className="w-full flex justify-end mt-4">
          <span className="text-xs text-gray-700 ml-auto">
            {' '}
            {new Date(props.timeStamp).toLocaleTimeString('en-US')}
            {' | '}
            {new Date(props.timeStamp).toLocaleDateString('en-US')}
          </span>
        </div>
      </div>
    </div>
  );
};
