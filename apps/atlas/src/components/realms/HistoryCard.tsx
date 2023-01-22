import { OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import type { ReactElement } from 'react';
import { getRealmNameById, getRealmOrderById } from './RealmsGetters';

interface Props {
  children?: React.ReactNode;
  timeStamp: string;
  event: any;
  action: string | ReactElement;
  eventId?: string | null;
  image?: string;
  realmId: number;
}

export const HistoryCard = (props: Props) => {
  const { children, timeStamp, event, action, eventId, image, realmId } = props;

  return (
    <div
      className={`flex mb-6 justify-between w-full relative border-4 border-yellow-800/40 bg-gradient-to-r from-gray-900 to-gray-1000    rounded`}
    >
      <img
        className="w-32 h-32 rounded-br-full shadow"
        src={image ? image : `/vizirs/mj_builder.png`}
        alt=""
      />
      <div className="z-10 flex flex-wrap flex-grow w-auto p-3 mr-auto">
        <div className="w-full mb-2 rounded bg-gray-900/10">
          <h3 className="flex justify-between border-b border-white/20">
            {getRealmNameById(realmId)}{' '}
            <OrderIcon
              className="self-center mr-3"
              size="sm"
              order={getRealmOrderById(realmId) || ''}
            />{' '}
          </h3>
        </div>
        <div className="flex">
          <div className="flex-auto">
            <div className="flex justify-between ">
              <div className="text-xl"> {event}</div>
            </div>

            {children}
            {action && <div className="mt-2">{action}</div>}
          </div>
        </div>
        <div className="flex justify-end w-full mt-4 ml-auto">
          <span className="ml-auto text-gray-600 text-body">
            {' '}
            {new Date(timeStamp).toLocaleTimeString('en-US')}
            {' | '}
            {new Date(timeStamp).toLocaleDateString('en-US')}
          </span>
        </div>
      </div>
    </div>
  );
};
