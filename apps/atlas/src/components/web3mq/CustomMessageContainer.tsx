import { SendMsgLoadingMap } from 'web3-mq';
import { Avatar, Loading } from 'web3-mq-react';
import type { MessageItem } from 'web3-mq-react';

import { botMainKeys, getShortAddress } from './LordsChatProvider';

export const CustomMessageContainer = (props: { message: MessageItem }) => {
  const { message } = props;
  const {
    content,
    date,
    timestamp,
    senderId,
    senderInfo = {},
    msgLoading = SendMsgLoadingMap['success'],
  } = message;
  const { avatar_url: avatarUrl, nickname } = senderInfo.web3mqInfo || {};
  const avatar = avatarUrl || senderInfo.defaultUserAvatar;
  const nickName =
    nickname || senderInfo.defaultUserName || getShortAddress(senderId);

  if (senderId === botMainKeys.userid) {
    return (
      <div
        className="w-full break-all text-center py-1 text-base font-semibold"
        style={{ color: '#A1A1AA' }}
      >
        {content}
      </div>
    );
  }
  return (
    <div className="flex items-start py-2.5">
      <Avatar name="user" image={avatar} size={30} />
      <div className="w-full">
        <div>
          <span
            style={{ color: '#F4F4F5' }}
            className="inline-block whitespace-nowrap leading-6 mr-2 text-base font-semibold"
          >
            {nickName}
          </span>
          <span
            style={{ color: '#A1A1AA' }}
            className="inline-block whitespace-nowrap leading-6 text-sm font-normal"
          >
            {date}&nbsp;{timestamp}
          </span>
        </div>
        <div className="flex items-center">
          <div className="flex-nowrap">
            <div className="break-all leading-6 text-base font-normal">
              {content}
            </div>
          </div>
          {msgLoading === SendMsgLoadingMap['loading'] && (
            <Loading className="web3mq-msg-load" />
          )}
        </div>
      </div>
    </div>
  );
};
