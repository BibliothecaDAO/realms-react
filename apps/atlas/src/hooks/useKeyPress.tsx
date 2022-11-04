'use client';

import { useState, useEffect } from 'react';

const Keycodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// Hook
export default function useKeyPress(target: {
  key?: string;
  keycode?: keyof typeof Keycodes;
}) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  // If pressed key is our target key then set to true
  function downHandler({ key, keyCode }) {
    if (
      key === target.key ||
      (target.keycode && keyCode == Keycodes[target.keycode])
    ) {
      setKeyPressed(true);
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ key, keyCode }) => {
    if (
      key === target.key ||
      (target.keycode && keyCode == Keycodes[target.keycode])
    ) {
      setKeyPressed(false);
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}
