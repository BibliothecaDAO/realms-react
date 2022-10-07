import { useChannel, usePresence, configureAbly } from '@ably-labs/react-hooks';
import { Button, Card } from '@bibliotheca-dao/ui-lib/base';
import { useAccount } from '@starknet-react/core';
import type { Types } from 'ably';
import React, { useEffect, useRef, useState } from 'react';

import TokenLabel from '@/shared/ElementsLabel';

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

  const { address } = useAccount();

  const [channel] = useChannel(props.channelName, (message) => {
    // 200 is the max number of messages to keep in the chat
    setMessages((msgs) => [...msgs.slice(-199), message]);
  });

  useEffect(() => {
    channel.history({ limit: 40 }, (err, result) => {
      if (result?.items) {
        setMessages(result.items);
      }
    });
  }, [channel]);
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
        body: messageText,
        address,
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
    <Card className="absolute bottom-0 left-0 z-50 card">
      <div className="flex items-center justify-between text-lg font-bold">
        <h5>
          {/* <Annotation className="inline-block w-4 h-4 mr-1" /> */}
          Lords chat
        </h5>
        <span className="text-xs text-gray-600">
          <div className="flex">
            <div className="self-center w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
            {presenceData.length} online
          </div>
        </span>
      </div>
      <div className="h-32 p-2 overflow-y-scroll bg-black border rounded-md card max-h-32">
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
          className="w-full h-10 p-2 rounded-sm bg-gray-1100"
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
        ></textarea>
        <Button variant="primary" type="submit" disabled={messageTextIsEmpty}>
          Send
        </Button>
        {/* <span className="p-1 ml-2 text-xs border border-gray-400">ENTER</span> */}
      </form>
    </Card>
  );
};

export default ChatComponent;
