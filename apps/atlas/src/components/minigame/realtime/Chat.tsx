import { useChannel, usePresence, configureAbly } from '@ably-labs/react-hooks';
import { useStarknet } from '@starknet-react/core';
import type { Types } from 'ably';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import useGameVariables from '@/hooks/desiege/useGameVariables';
import { useTokenBalances } from '@/hooks/desiege/useTokenBalances';

import TokenLabel, {
  DarkGradient,
  LightGradient,
} from '@/shared/ElementsLabel';
import { Annotation } from '@/shared/Icons';

type ChatComponentProps = {
  channelName: string;
};

configureAbly({
  authUrl: '/api/createAblyTokenRequest',
});

const ChatComponent = (props: ChatComponentProps) => {
  const inputBox = useRef<HTMLTextAreaElement>(null);
  const messageEnd = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setMessages] = useState<Types.Message[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [messagesFilter, setMessagesFilter] = useState<'light' | 'dark' | '*'>(
    '*'
  );

  const { account } = useStarknet();

  const gameVars = useGameVariables();

  const tokenBalance = useTokenBalances({
    gameIdx: gameVars.data?.gameIdx,
  });

  const [channel] = useChannel(props.channelName, (message) => {
    // 200 is the max number of messages to keep in the chat
    setMessages((msgs) => [...msgs.slice(-199), message]);
  });

  const [presenceData, updateStatus] = usePresence(props.channelName);

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [receivedMessages]);

  const sendChatMessage = (messageText) => {
    channel.publish({
      name: 'chat-message',
      data: {
        side: tokenBalance.side,
        body: messageText,
        account,
      },
    });
    setMessageText('');
    if (inputBox.current) {
      inputBox.current.focus();
    }
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyPress = (e: any) => {
    if (e.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    e.preventDefault();
  };

  const messages = receivedMessages.map((message, index) => {
    return (
      <p key={index}>
        <TokenLabel side={message.data.side as 'light' | 'dark' | undefined}>
          {message.data.account
            ? `0x${message.data.account.substring(
                message.data.account.length - 4
              )}: `
            : 'anon: '}
        </TokenLabel>
        {message.data.body}
      </p>
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between text-lg font-bold">
        <span>
          <Annotation className="inline-block w-4 h-4 mr-1" />
          LoreBox
        </span>
        <span className="text-xs text-gray-600">
          ({presenceData.length} online)
        </span>
      </div>
      <div className="h-32 p-2 overflow-y-scroll bg-gray-200 rounded-md max-h-32">
        {messages.length == 0 ? (
          <p className="mt-8 text-center animate-pulse">
            whispers through the mist
          </p>
        ) : null}
        {messages}
        <div ref={messageEnd}></div>
      </div>
      <form className="mt-2" onSubmit={handleFormSubmission}>
        <textarea
          ref={inputBox}
          className="w-full h-10 p-2 rounded-sm"
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
        ></textarea>
        <button
          className="px-2 py-1 text-white transition-colors bg-blue-500 rounded-sm disabled:cursor-not-allowed disabled:bg-blue-300"
          type="submit"
          disabled={messageTextIsEmpty}
        >
          Send
        </button>
        <span className="p-1 ml-2 text-xs border border-gray-400">ENTER</span>
      </form>
    </div>
  );
};

export default ChatComponent;
