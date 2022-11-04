'use client';
/* eslint-disable */

import { useEffect, useState } from 'react';
import useKeyPress from '../useKeyPress';

export const HotKeys = {
  Army: 'w',
  Resources: 'e',
  History: 't',
  Overview: 'q',
  Lore: 'y',
  Food: 'r',
};

export type Subview = keyof typeof HotKeys | null;

const useRealmDetailHotkeys = (initialSubview?: Subview) => {
  const [subview, setSubview] = useState<Subview>(initialSubview || null);

  const attackPress = useKeyPress({ key: HotKeys.Army });
  const historyPress = useKeyPress({ key: HotKeys.History });
  const overviewPress = useKeyPress({ key: HotKeys.Overview });
  const resourcesPress = useKeyPress({ key: HotKeys.Resources });
  const lorePress = useKeyPress({ key: HotKeys.Lore });
  const foodPress = useKeyPress({ key: HotKeys.Food });

  useEffect(() => {
    if (attackPress) {
      subview == 'Army' ? setSubview(null) : setSubview('Army');
    }
    if (resourcesPress) {
      subview == 'Resources' ? setSubview(null) : setSubview('Resources');
    }
    if (overviewPress) {
      subview == 'Overview' ? setSubview(null) : setSubview('Overview');
    }
    if (lorePress) {
      subview == 'Lore' ? setSubview(null) : setSubview('Lore');
    }
    if (historyPress) {
      subview == 'History' ? setSubview(null) : setSubview('History');
    }
    if (foodPress) {
      subview == 'Food' ? setSubview(null) : setSubview('Food');
    }
  }, [
    attackPress,
    overviewPress,
    resourcesPress,
    historyPress,
    lorePress,
    foodPress,
  ]);

  return {
    subview,
    clear: () => setSubview(null),
    set: (val: Subview) => setSubview(val),
    attackPress,
    overviewPress,
    resourcesPress,
    historyPress,
    lorePress,
  };
};

export default useRealmDetailHotkeys;
