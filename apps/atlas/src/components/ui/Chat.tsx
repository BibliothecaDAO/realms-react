import { useChannel, usePresence, configureAbly } from '@ably-labs/react-hooks';
import { Button, Card } from '@bibliotheca-dao/ui-lib/base';
import { useAccount } from '@starknet-react/core';
import type { Types } from 'ably';
import React, { useEffect, useRef, useState } from 'react';
import { sidebarClassNames } from '@/constants/ui';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { shortenAddress } from '@/util/formatters';
import AtlasSideBar from '../map/AtlasSideBar';
import { BaseSideBarPanel } from './sidebar/BaseSideBarPanel';

const prefix =
  (process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
  'http://localhost:3000';

configureAbly({
  authUrl: `${prefix}/api/createAblyTokenRequest`,
});

interface ChatSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
  channelName: string;
}

export const ChatSideBar = ({
  isOpen,
  onClose,
  channelName,
}: ChatSideBarProps) => {
  return (
    <AtlasSideBar
      isOpen={isOpen}
      containerClassName={sidebarClassNames.replace('z-30', 'z-50')}
    >
      {isOpen && (
        <ChatSideBarPanel onClose={onClose} channelName={channelName} />
      )}
    </AtlasSideBar>
  );
};

const ChatSideBarPanel = ({
  onClose,
  channelName,
}: {
  onClose?: () => void;
  channelName: string;
}) => {
  const inputBox = useRef<HTMLInputElement>(null);
  const messageContainer = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setMessages] = useState<Types.Message[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const { address } = useAccount();

  const { starknetId } = useStarkNetId(address || '');

  const [channel] = useChannel(channelName, (message) => {
    // 200 is the max number of messages to keep in the chat
    setMessages((msgs) => [...msgs.slice(-199), message]);
  });

  useEffect(() => {
    channel.history({ limit: 40 }, (err, result) => {
      if (result?.items) {
        setMessages(result.items.reverse());
      }
    });
  }, [channel]);
  const [presenceData, updateStatus] = usePresence(channelName);

  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scroll({
        top: messageContainer.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [receivedMessages]);

  const sendChatMessage = (messageText) => {
    if (messageText.length < 2) {
      return;
    }
    channel.publish({
      name: 'chat-message',
      data: {
        body: messageText,
        address,
        starknetId,
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
      <div
        key={index}
        className={`flex flex-col p-4 mb-4 bg-white rounded-lg bg-opacity-5 w-fit ${
          message.data.address == address ? 'ml-auto text-right' : 'mr-auto'
        }`}
      >
        <div
          className="text-yellow-600"
          style={{
            color:
              message.data.address == address
                ? ''
                : `#${message.data.address.substr(2, 6) || '000000'}`,
          }}
        >
          {message.data.starknetId || shortenAddress(message.data.address)}:
        </div>
        <div>{message.data.body}</div>
      </div>
    );
  });

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between text-xl font-bold">
        <h5>
          {/* <Annotation className="inline-block w-4 h-4 mr-1" /> */}
          Lords chat
        </h5>
        <span className="text-sm text-gray-600">
          <div className="flex">
            <div className="self-center w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
            {presenceData.length} online
          </div>
        </span>
      </div>
      <div className="flex-1 my-4 overflow-y-scroll" ref={messageContainer}>
        {messages.length == 0 ? (
          <p className="mt-8 text-center animate-pulse">
            whispers through the mist
          </p>
        ) : null}
        {messages}
      </div>
      <form className="flex mt-2" onSubmit={handleFormSubmission}>
        <div className="flex items-center justify-center w-full gap-1 p-1 shadow-inner rounded-xl bg-gray-1000">
          <input
            type="text"
            ref={inputBox}
            className="w-full px-3 py-1 text-sm font-bold leading-tight tracking-widest transition-all duration-300 rounded-lg shadow-md appearance-none h-9 focus:outline-none bg-gray-800/40 hover:bg-gray-300/20"
            value={messageText}
            placeholder="Type a message..."
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="flex items-center justify-center p-2 transition-all duration-300 cursor-pointer whitespace-nowrap rounded-xl h-9 hover:bg-gray-300/20"
            type="submit"
          >
            Send message
          </button>
        </div>
        {/* <span className="p-1 ml-2 text-xs border border-gray-400">ENTER</span> */}
      </form>
    </div>
  );
};
