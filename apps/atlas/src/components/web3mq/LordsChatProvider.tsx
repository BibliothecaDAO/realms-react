import React, { useState, useEffect, useCallback } from 'react';
import { Client } from 'web3-mq';
import type { KeyPairsType, EventTypes } from 'web3-mq';
import { useChatContext } from 'web3-mq-react';

export const getShortAddress = (address = '', num = 5, endNum = 4) => {
  const strLength = address.length;
  return (
    address.substring(0, num) +
    '...' +
    address.substring(strLength - endNum, strLength)
  );
};

export const botMainKeys = {
  mainPrivateKey:
    'sPDsP3D3upCELZj09bDlfLTdQ7TQbv0UjkX0/TvVBvRwtAiyPRa3zjJqjO7XHyIfb424yH0v65tq+FCiVb+VWN7hUmVk7pCNsF91cb8zDCo=',
  mainPublicKey:
    'bf305d9013d9aeed058e3ae89ab717481f2583a30ef5aca973cfdacb7f13bad3',
  userid: 'user:0a6fe1808a3bfbb9a328980e356ce609b26f385adf08633fbfddc010',
  walletAddress: '0xec6d78fd4dba4e4c723349b3f21b53d3a9273975',
  password: 'web3mq',
};
export const groupid = 'group:093515bd06581759d05328cf241c399a05f1161f';
const PAGE = {
  page: 1,
  size: 9999,
};
export const LordsChatProvider = (props: {
  fastestUrl: string;
  keys: KeyPairsType;
  init: () => Promise<void>;
  children: React.ReactNode;
}) => {
  const { children, fastestUrl, keys, init } = props;
  const { client, loginUserInfo } = useChatContext();
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<any[]>([]);

  const queryChatList = async () => {
    await client.channel.queryChannels(PAGE);
  };
  const joinLordsChat = useCallback(async () => {
    await client.channel.joinGroup(groupid);
    const expired =
      Number(localStorage.getItem('BOT_PUBKEY_EXPIRED_TIMESTAMP')) || '';
    let botPrivateKey = localStorage.getItem('BOT_PRIVATE_KEY') || '';
    let botPublicKey = localStorage.getItem('BOT_PUBLIC_KEY') || '';
    if (!botPrivateKey || !botPublicKey || !expired || Date.now() > expired) {
      const {
        TempPrivateKey: tempPrivateKey,
        TempPublicKey: tempPublicKey,
        pubkeyExpiredTimestamp,
      } = await Client.register.login({
        password: botMainKeys.password,
        userid: botMainKeys.userid,
        did_value: botMainKeys.walletAddress,
        mainPublicKey: botMainKeys.mainPrivateKey,
        mainPrivateKey: botMainKeys.mainPrivateKey,
      });
      botPrivateKey = tempPrivateKey;
      botPublicKey = tempPublicKey;
      localStorage.setItem('BOT_PRIVATE_KEY', tempPrivateKey);
      localStorage.setItem('BOT_PUBLIC_KEY', tempPublicKey);
      localStorage.setItem(
        'BOT_PUBKEY_EXPIRED_TIMESTAMP',
        String(pubkeyExpiredTimestamp)
      );
    }
    client.keys.userid = botMainKeys.userid;
    client.keys.PrivateKey = botPrivateKey;
    const { defaultUserName = '' } = loginUserInfo as any;
    const { nickname } = (loginUserInfo as any).web3mqInfo || {};
    const userName =
      nickname || defaultUserName || getShortAddress(keys.userid);
    await client.message.sendMessage(
      `Welcome ${userName} to the realms chat`,
      groupid
    );
    await init();
    client.keys.userid = keys.userid;
    client.keys.PrivateKey = keys.PrivateKey;
  }, [loginUserInfo, fastestUrl, keys]);

  const getLordsChannel = useCallback(
    async (channelList: any[]) => {
      const lordschat = channelList.find(
        (channel) => channel.chatid === groupid
      );
      if (!lordschat) {
        const chat = {
          avatar_base64: '',
          avatar_url: '',
          chat_name: 'Lords chat',
          chat_type: 'group',
          chatid: groupid,
        };
        await joinLordsChat();
        channelList.push(chat);
        return chat;
      } else {
        return lordschat;
      }
    },
    [joinLordsChat]
  );

  const handleEvent = useCallback(
    async (props: { type: EventTypes }) => {
      const { type } = props;
      const { channelList } = client.channel;
      if (!channelList) {
        return;
      }
      if (type === 'channel.getList') {
        const lordsChannel = await getLordsChannel(channelList);
        setLoading(false);
        setChannels(channelList);
        await client.channel.setActiveChannel(lordsChannel);
      }
    },
    [joinLordsChat]
  );

  useEffect(() => {
    if (loginUserInfo) {
      queryChatList();
    }
  }, [loginUserInfo]);

  useEffect(() => {
    client.on('contact.getList', handleEvent);
    client.on('channel.getList', handleEvent);
    client.on('channel.updated', handleEvent);
    client.on('channel.activeChange', handleEvent);
    client.on('message.delivered', handleEvent);
    return () => {
      client.off('contact.getList', handleEvent);
      client.off('channel.getList', handleEvent);
      client.off('channel.updated', handleEvent);
      client.off('channel.activeChange', handleEvent);
      client.off('message.delivered', handleEvent);
    };
  }, [handleEvent]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div
            style={{
              border: '6px solid rgba(97, 94, 240, 1)',
              borderTopColor: 'rgba(97, 94, 240, 0.2)',
              borderRightColor: 'rgba(97, 94, 240, 0.2)',
              borderBottomColor: 'rgba(97, 94, 240, 0.2)',
            }}
            className="relative border-6 rounded-full w-9 h-9 border-purple-400 animate-spin"
          ></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
