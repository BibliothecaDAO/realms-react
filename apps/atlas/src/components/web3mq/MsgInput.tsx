import React, { useState, useRef } from 'react';
import { useMessageInputContext } from 'web3-mq-react';

export const MsgInput = () => {
  const { sendMessage } = useMessageInputContext('ChatAutoComplete');
  const inputBox = useRef<HTMLTextAreaElement>(null);
  const [messageText, setMessageText] = useState('');

  const sendChatMessage = async (messageText) => {
    if (messageText === '') {
      return;
    }
    sendMessage(messageText);
    setMessageText('');
    if (inputBox.current) {
      inputBox.current.focus();
    }
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key, keyCode, metaKey } = e;
    if (key === 'Enter' && keyCode !== 229 && metaKey) {
      setMessageText(messageText + '\n');
      return;
    }
    if (key === 'Enter' && keyCode !== 229) {
      e.preventDefault();
      sendChatMessage(messageText);
    }
  };

  return (
    <form className="flex mt-2" onSubmit={handleFormSubmission}>
      <div className="flex items-center justify-center w-full gap-1 p-1 shadow-inner rounded-xl bg-gray-1000">
        <textarea
          ref={inputBox}
          className="resize-none w-full px-3 py-1 text-sm font-bold leading-7 tracking-widest transition-all duration-300 rounded-lg shadow-md appearance-none h-9 focus:outline-none bg-gray-800/40 hover:bg-gray-300/20"
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="flex items-center justify-center p-2 transition-all duration-300 cursor-pointer whitespace-nowrap rounded-xl h-9 hover:bg-gray-300/20"
          type="submit"
        >
          Send message
        </button>
      </div>
    </form>
  );
};
