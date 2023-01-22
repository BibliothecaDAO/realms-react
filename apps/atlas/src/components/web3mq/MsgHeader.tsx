import { useChannelStateContext } from 'web3-mq-react';

export const MsgHeader = () => {
  const { activeChannel } = useChannelStateContext('MessageHeader');

  if (!activeChannel) {
    return null;
  }
  const { chat_name: chatName } = activeChannel;

  return (
    <div className="flex items-center justify-between text-xl font-bold">
      <h5>{chatName}</h5>
      <span className="text-sm text-gray-600">
        <div className="flex">
          <div className="self-center w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
          {/* {presenceData.length}  */}
          online
        </div>
      </span>
    </div>
  );
};
