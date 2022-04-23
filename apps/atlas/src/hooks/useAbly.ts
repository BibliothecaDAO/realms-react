import type { Types } from 'ably';
import Ably from 'ably/promises';
import { useEffect } from 'react';

const ably = new Ably.Realtime.Promise({
  authUrl: '/api/createAblyTokenRequest',
});

export function useChannel<T>(
  channelName: string,
  callbackOnMessage: (message: T) => void
): [Types.RealtimeChannelPromise, Types.RealtimePromise] {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe((msg: any) => {
      callbackOnMessage(msg as T);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  useEffect(() => {
    onMount();
    return () => {
      onUnmount();
    };
  });

  return [channel, ably];
}
