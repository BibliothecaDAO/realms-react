import { useEffect, useState } from 'react';
import { Client } from 'web3-mq';
import type { KeyPairsType, WalletType } from 'web3-mq';

type MainKeysType = {
  publicKey: string;
  privateKey: string;
  walletAddress: string;
};
type UserAccountType = {
  userid: string;
  address: string;
  walletType: WalletType;
  userExist: boolean;
};

const useLogin = () => {
  const [keys, setKeys] = useState<KeyPairsType | null>(null);
  const [mainKeys, setMainKeys] = useState<MainKeysType | null>(null);
  const [fastestUrl, setFastUrl] = useState<string | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccountType | undefined>(
    undefined
  );

  const getAccount = async (address: string) => {
    if (address) {
      const { userid, userExist } = await Client.register.getUserInfo({
        did_value: address,
        did_type: 'starknet',
      });
      localStorage.setItem('userid', userid);
      setUserAccount({
        userid,
        address: address,
        walletType: 'starknet',
        userExist,
      });
    }
  };

  const init = async () => {
    const tempPubkey = localStorage.getItem('PUBLIC_KEY') || '';
    const didKey = localStorage.getItem('DID_KEY') || '';
    const fastUrl = await Client.init({
      connectUrl: localStorage.getItem('FAST_URL'),
      app_key: 'vAUJTFXbBZRkEDRE',
      env: 'test',
      didKey,
      tempPubkey,
    });
    localStorage.setItem('FAST_URL', fastUrl);
    setFastUrl(fastUrl);
  };

  const logout = () => {
    localStorage.setItem('PRIVATE_KEY', '');
    localStorage.setItem('PUBLIC_KEY', '');
    localStorage.setItem('DID_KEY', '');
    localStorage.setItem('userid', '');
    setKeys(null);
  };

  const handleLoginEvent = (eventData: any) => {
    if (eventData.data) {
      if (eventData.type === 'login') {
        const {
          privateKey,
          publicKey,
          tempPrivateKey,
          tempPublicKey,
          didKey,
          userid,
          address,
          pubkeyExpiredTimestamp,
        } = eventData.data;
        localStorage.setItem('userid', userid);
        localStorage.setItem('PRIVATE_KEY', tempPrivateKey);
        localStorage.setItem('PUBLIC_KEY', tempPublicKey);
        localStorage.setItem('WALLET_ADDRESS', address);
        localStorage.setItem(`MAIN_PRIVATE_KEY`, privateKey);
        localStorage.setItem(`MAIN_PUBLIC_KEY`, publicKey);
        localStorage.setItem(`DID_KEY`, didKey);
        localStorage.setItem(
          'PUBKEY_EXPIRED_TIMESTAMP',
          String(pubkeyExpiredTimestamp)
        );
        setKeys({
          PrivateKey: tempPrivateKey,
          PublicKey: tempPublicKey,
          userid,
        });
      }
      if (eventData.type === 'register') {
        const { privateKey, publicKey, address } = eventData.data;
        localStorage.setItem('WALLET_ADDRESS', address);
        localStorage.setItem(`MAIN_PRIVATE_KEY`, privateKey);
        localStorage.setItem(`MAIN_PUBLIC_KEY`, publicKey);
      }
    }
  };

  useEffect(() => {
    const mainPrivateKey = localStorage.getItem(`MAIN_PRIVATE_KEY`);
    const mainPublicKey = localStorage.getItem(`MAIN_PUBLIC_KEY`);
    const address = localStorage.getItem('WALLET_ADDRESS');
    if (mainPublicKey && mainPrivateKey && address) {
      setMainKeys({
        publicKey: mainPublicKey,
        privateKey: mainPrivateKey,
        walletAddress: address,
      });
    }
    const privateKey = localStorage.getItem('PRIVATE_KEY') || '';
    const publicKey = localStorage.getItem('PUBLIC_KEY') || '';
    const userid = localStorage.getItem('userid') || '';
    if (privateKey && publicKey && userid) {
      setKeys({ PrivateKey: privateKey, PublicKey: publicKey, userid });
    }
  }, []);

  return {
    keys,
    fastestUrl,
    mainKeys,
    userAccount,
    getAccount,
    init,
    logout,
    handleLoginEvent,
  };
};

export default useLogin;
