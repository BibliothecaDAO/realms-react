import { useChannel } from '@ably-labs/react-hooks';
import React, { useState, useEffect, useRef } from 'react';
import {
  BattleAction,
  battleChannelName,
  useBattleContext,
} from '@/hooks/desiege/useBattleContext';

const BattleHandler = () => {
  const darkResetTimer = useRef<NodeJS.Timeout>();
  const lightResetTimer = useRef<NodeJS.Timeout>();

  const battleContext = useBattleContext();

  const [lastDarkMessageId, setLastDarkMessageId] = useState<string>();
  const [lastLightMessageId, setLastLightMessageId] = useState<string>();

  // Show the action for 2 minutes, then reset
  const actionDisplayTimeout = 1000 * 60 * 2;

  useEffect(() => {
    if (darkResetTimer.current) {
      clearTimeout(darkResetTimer.current);
    }
    darkResetTimer.current = setTimeout(() => {
      battleContext.setDarkAttacking(false);
    }, actionDisplayTimeout);
  }, [lastDarkMessageId]);

  useEffect(() => {
    if (lightResetTimer.current) {
      clearTimeout(lightResetTimer.current);
    }
    lightResetTimer.current = setTimeout(() => {
      battleContext.setLightShielding(false);
    }, actionDisplayTimeout);
  }, [lastLightMessageId]);

  useEffect(() => {
    // Clear timeouts when unmounting
    if (darkResetTimer.current) {
      clearTimeout(darkResetTimer.current);
    }
    if (lightResetTimer.current) {
      clearTimeout(lightResetTimer.current);
    }
  }, []);

  const [_channel, _ably] = useChannel(battleChannelName, (message) => {
    if (message.data === BattleAction.DarkAttack) {
      battleContext.setDarkAttacking(true);
      setLastDarkMessageId(message.id);
    } else if (message.data === BattleAction.LightShield) {
      battleContext.setLightShielding(true);
      setLastLightMessageId(message.id);
    }
  });
  // Empty component, just used to manipulate BattleContext
  return <></>;
};

export default BattleHandler;
