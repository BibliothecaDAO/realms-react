import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useChannel } from '@/hooks/useAbly';
import { Annotation } from '@/shared/Icons';

type ChatComponentProps = {
  channelName: string;
};

interface BaseMessageType {
  connectionId: string;
  data: string;
}

const ChatComponent = <MT extends BaseMessageType>(
  props: ChatComponentProps
) => {
  const inputBox = useRef<HTMLTextAreaElement>(null);
  const messageEnd = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setMessages] = useState<MT[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel, ably] = useChannel<MT>(props.channelName, (message) => {
    // Here we're computing the state that'll be drawn into the message history
    // We do that by slicing the last 199 messages from the receivedMessages buffer

    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

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
    channel.publish({ name: 'chat-message', data: messageText });
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
    const author = message.connectionId === ably.connection.id ? 'me' : 'other';
    return (
      <p
        key={index}
        className={classNames(
          author == 'me' ? 'text-blue-800' : 'text-gray-900'
        )}
        data-author={author}
      >
        {message.data}
      </p>
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between text-lg font-bold">
        <span>
          <Annotation className="inline-block w-4 h-4 mr-1" />
          LoreBox
        </span>{' '}
        <span className="text-xs">
          {' '}
          <span className="inline-block w-2 h-2 border border-gray-600 rounded-full"></span>{' '}
          Not Recording
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
