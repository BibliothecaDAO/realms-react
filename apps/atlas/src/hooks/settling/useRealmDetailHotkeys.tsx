/* eslint-disable */

import { useEffect, useState } from 'react';
import useKeyPress from '../useKeyPress';

export const HotKeys = {
  Overview: 'q',
  MilitaryBuildings: 'w',
  DefendingArmy: 'e',
  AttackingArmy: 'r',
  FoodResources: 't',
  Lore: 'y',
};

export type Subview = keyof typeof HotKeys | null;

const useRealmDetailHotkeys = (initialSubview?: Subview) => {
  const [subview, setSubview] = useState<Subview>(initialSubview || 'Overview');

  const overviewPress = useKeyPress({ key: HotKeys.Overview });
  const militaryBuildingsPress = useKeyPress({
    key: HotKeys.MilitaryBuildings,
  });
  const defendingArmyPress = useKeyPress({ key: HotKeys.DefendingArmy });
  const attackingArmyPress = useKeyPress({ key: HotKeys.AttackingArmy });
  const foodResourcesPress = useKeyPress({ key: HotKeys.FoodResources });
  const lorePress = useKeyPress({ key: HotKeys.Lore });

  useEffect(() => {
    if (overviewPress) {
      subview == 'Overview' ? setSubview(null) : setSubview('Overview');
    }
    if (militaryBuildingsPress) {
      subview == 'MilitaryBuildings'
        ? setSubview(null)
        : setSubview('MilitaryBuildings');
    }
    if (defendingArmyPress) {
      subview == 'DefendingArmy'
        ? setSubview(null)
        : setSubview('DefendingArmy');
    }
    if (attackingArmyPress) {
      subview == 'AttackingArmy'
        ? setSubview(null)
        : setSubview('AttackingArmy');
    }
    if (foodResourcesPress) {
      subview == 'FoodResources'
        ? setSubview(null)
        : setSubview('FoodResources');
    }
    if (lorePress) {
      subview == 'Lore' ? setSubview(null) : setSubview('Lore');
    }
  }, [
    overviewPress,
    militaryBuildingsPress,
    defendingArmyPress,
    attackingArmyPress,
    foodResourcesPress,
    lorePress,
  ]);

  return {
    subview,
    clear: () => setSubview(null),
    set: (val: Subview) => setSubview(val),
    overviewPress,
    militaryBuildingsPress,
    defendingArmyPress,
    attackingArmyPress,
    foodResourcesPress,
    lorePress,
  };
};

export default useRealmDetailHotkeys;
