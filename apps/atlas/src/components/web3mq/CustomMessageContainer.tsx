import { useAccount } from '@starknet-react/core';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { Avatar } from 'web3-mq-react';
import type { MessageItem } from 'web3-mq-react';

import { botMainKeys, getShortAddress } from './LordsChatProvider';

export const CustomMessageContainer = (props: { message: MessageItem }) => {
  const { message } = props;
  const { content, date, timestamp, senderId, senderInfo = {} } = message;
  const { avatar_url: avatarUrl, nickname } = senderInfo?.web3mqInfo || {};
  const { address: currentUserAddress } = useAccount();
  const { address: currentUserL1Address } = useL1Account();
  const avatar = avatarUrl || senderInfo?.defaultUserAvatar;
  const nickName =
    nickname || senderInfo?.defaultUserName || getShortAddress(senderId);

  const isCurrentUser = useMemo(
    () =>
      senderInfo?.wallet_address == currentUserAddress ||
      senderInfo?.wallet_address == currentUserL1Address,
    [senderInfo?.wallet_address, currentUserAddress, currentUserL1Address]
  );

  if (senderId === botMainKeys.userid) {
    return (
      <div
        className="w-full py-1 text-base font-semibold text-center break-all"
        style={{ color: '#A1A1AA' }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex items-end mb-4 mr-2',
        isCurrentUser && 'flex-row-reverse'
      )}
    >
      <Avatar
        name="user"
        image={avatar}
        size={30}
        className={`${!isCurrentUser ? '' : 'ml-2 !mr-0'}`}
      />
      <div
        className={`flex flex-col p-2 px-2 bg-white relative rounded-xl bg-opacity-5 w-fit ${
          isCurrentUser ? 'ml-auto text-right' : 'mr-auto'
        }`}
      >
        <div
          className="text-yellow-600"
          style={{
            color: isCurrentUser
              ? ''
              : `#${senderInfo?.address.substr(2, 6) || '000000'}`,
          }}
        >
          {nickName}
        </div>
        <div className="mr-8">{content}</div>
        <div className="absolute text-sm bottom-2 right-2 text-white/20">
          {timestamp}
        </div>
      </div>
    </div>
  );
};
