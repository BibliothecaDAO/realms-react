import React from 'react';
import { Client } from 'web3-mq';
import type { KeyPairsType } from 'web3-mq';
import {
  AppTypeEnum,
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
} from 'web3-mq-react';

import { LordsChatProvider } from './LordsChatProvider';
import { MsgHeader } from './MsgHeader';
import { MsgInput } from './MsgInput';
import { MsgSimple } from './MsgSimple';

export const Web3MQChat = (props: {
  fastestUrl: string;
  keys: KeyPairsType;
  init: () => Promise<void>;
  logout: () => void;
}) => {
  const { fastestUrl, keys, init, logout } = props;

  return (
    <Chat
      client={Client.getInstance({ ...keys })}
      appType={AppTypeEnum['h5']}
      logout={logout}
      containerId="chat-content"
    >
      <LordsChatProvider keys={keys} fastestUrl={fastestUrl} init={init}>
        <Channel className={'web3mq-channel-container p-6'}>
          <Window hasContainer>
            <MsgHeader />
            <MessageList Message={MsgSimple} />
            <MessageInput Input={MsgInput} />
          </Window>
        </Channel>
      </LordsChatProvider>
    </Chat>
  );
};
