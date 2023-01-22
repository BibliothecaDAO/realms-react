import { useEffect, useState } from 'react';
import { Client } from 'web3-mq';
import type { KeyPairsType, WalletType } from 'web3-mq';

const useLogin = () => {
  const [keys, setKeys] = useState<KeyPairsType | null>(null);
  const [fastestUrl, setFastUrl] = useState<string | null>(null);
  const [userAccount, setUserAccount] = useState<{
    userid: string;
    address: string;
  }>();

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

  const getEthAccount = async (didType: WalletType = 'eth') => {
    let address = '';
    const account = await Client.register.getAccount(didType);
    address = account.address;
    const { userid, userExist } = await Client.register.getUserInfo({
      did_value: address,
      did_type: didType,
    });
    localStorage.setItem('userid', userid);
    setUserAccount({
      userid,
      address,
    });
    return {
      address,
      userid,
      userExist,
    };
  };

  const login = async (password: string, didType: WalletType = 'eth') => {
    if (!userAccount) {
      return;
    }

    const localMainPrivateKey =
      localStorage.getItem(`${didType}_MAIN_PRIVATE_KEY`) || '';
    const localMainPublicKey =
      localStorage.getItem(`${didType}_MAIN_PUBLIC_KEY`) || '';

    const { userid, address } = userAccount;
    const {
      TempPrivateKey: tempPrivateKey,
      TempPublicKey: tempPublicKey,
      pubkeyExpiredTimestamp,
      mainPrivateKey,
      mainPublicKey,
    } = await Client.register.login({
      password,
      userid,
      did_value: address,
      did_type: didType,
      mainPublicKey: localMainPublicKey,
      mainPrivateKey: localMainPrivateKey,
    });
    localStorage.setItem('PRIVATE_KEY', tempPrivateKey);
    localStorage.setItem('PUBLIC_KEY', tempPublicKey);
    localStorage.setItem(`${didType}_MAIN_PRIVATE_KEY`, mainPrivateKey);
    localStorage.setItem(`${didType}_MAIN_PUBLIC_KEY`, mainPublicKey);
    localStorage.setItem(`DID_KEY`, `${didType}:${address}`);
    localStorage.setItem(
      'PUBKEY_EXPIRED_TIMESTAMP',
      String(pubkeyExpiredTimestamp)
    );
    setKeys({
      PrivateKey: tempPrivateKey,
      PublicKey: tempPublicKey,
      userid,
    });
  };

  const register = async (password: string, didType: WalletType = 'eth') => {
    if (!userAccount) {
      return;
    }
    const { address, userid } = userAccount;
    const { mainPrivateKey, mainPublicKey } = await Client.register.register({
      password,
      did_value: address,
      userid,
      did_type: didType,
      avatar_url: `https://cdn.stamp.fyi/avatar/${address}?s=300`,
    });
    localStorage.setItem(`${didType}_MAIN_PRIVATE_KEY`, mainPrivateKey);
    localStorage.setItem(`${didType}_MAIN_PUBLIC_KEY`, mainPublicKey);
  };

  const logout = () => {
    localStorage.setItem('PRIVATE_KEY', '');
    localStorage.setItem('PUBLIC_KEY', '');
    localStorage.setItem('DID_KEY', '');
    localStorage.setItem('userid', '');
    setKeys(null);
  };

  useEffect(() => {
    const privateKey = localStorage.getItem('PRIVATE_KEY') || '';
    const publicKey = localStorage.getItem('PUBLIC_KEY') || '';
    const userid = localStorage.getItem('userid') || '';
    if (privateKey && publicKey && userid) {
      setKeys({ PrivateKey: privateKey, PublicKey: publicKey, userid });
    }
  }, []);

  return { keys, fastestUrl, init, login, logout, getEthAccount, register };
};

export default useLogin;
