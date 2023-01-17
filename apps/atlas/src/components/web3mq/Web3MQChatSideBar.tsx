import React, { useEffect } from 'react';
import { AppTypeEnum, LoginModal, Button } from 'web3-mq-react';

import { sidebarClassNames } from '../../constants/ui';
import useWeb3MQLogin from '../../hooks/useWeb3MQLogin';
import AtlasSideBar from '../map/AtlasSideBar';

import { Web3MQChat } from './Web3MQChat';

import 'web3-mq-react/dist/css/index.css';

interface ChatSideBarProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
}

const styles = {
  modalBody: {
    background: '#000',
    color: '#E4E4E7',
  },
  homeContainer: {
    color: '#E4E4E7',
  },
  walletItem: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#E4E4E7',
  },
  contentBox: {
    color: '#E4E4E7',
  },
  addressBox: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#F4F4F5',
    border: 'none',
  },
  textBoxTitle: {
    color: '#E4E4E7',
  },
  textBoxSubTitle: {
    color: '#F4F4F5',
  },
  inputBox: {
    color: '#F4F4F5',
  },
  inputValue: {
    border: '2px solid #3F3F46',
    background: '#000',
    color: '#F4F4F5',
  },
  inputBoxInput: {
    background: '#000',
    color: '#F4F4F5',
  },
  loginButton: {
    background: '#615EF0',
    color: '#FFFFFF',
  },
  tipsText: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#F4F4F5',
    border: 'none',
  },
  homeButton: {
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#F4F4F5',
  },
  loadingBox: {
    background: '#fff',
  },
};

export const Web3MQChatSideBar = ({
  isOpen,
  onClose,
  channelName,
}: ChatSideBarProps) => {
  const { init, fastestUrl, keys, getEthAccount, login, logout, register } =
    useWeb3MQLogin();

  useEffect(() => {
    document
      .getElementsByTagName('body')[0]
      .setAttribute('data-theme', 'light');
    init();
  }, []);

  return (
    <AtlasSideBar
      isOpen={isOpen}
      containerClassName={sidebarClassNames.replace('z-30', 'z-50')}
    >
      {isOpen && (
        <div id={'chat-content'} className={'relative w-full h-full'}>
          {!keys ? (
            <LoginModal
              appType={AppTypeEnum['h5']}
              containerId="chat-content"
              isShow={true}
              loginBtnNode={
                <div className="absolute left-2/4 top-2/4 -translate-x-1/2 -translate-y-1/2">
                  <Button>Login</Button>
                </div>
              }
              modalClassName={'web3mq-dialog'}
              styles={styles}
              getEthAccount={getEthAccount}
              login={login}
              register={register}
            />
          ) : fastestUrl ? (
            <Web3MQChat
              fastestUrl={fastestUrl}
              keys={keys}
              init={init}
              logout={logout}
            />
          ) : null}
        </div>
      )}
    </AtlasSideBar>
  );
};
