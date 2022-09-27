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
    <Card className={`flex flex-wrap mb-2 justify-between w-full relative`}>
      <Image
        objectFit="cover"
        className="rounded-xl brightness-50 contrast-75 "
        layout="fill"
        src={`https://ingave-images.s3.eu-west-3.amazonaws.com/37a7186b-${props.eventId}.png`}
        alt=""
      />
      <div className="z-10 justify-between w-full">
        <div className="px-2 py-1 text-sm rounded-xl font-display">
          {new Date(props.timeStamp).toLocaleTimeString('en-US')}
          {' | '}
          {new Date(props.timeStamp).toLocaleDateString('en-US')}
        </div>
        <h3 className="py-2 "> {props.event}</h3>

        {props.children}
        <div className="pt-5">{props.action}</div>
      </div>
    </Card>
  );
};
