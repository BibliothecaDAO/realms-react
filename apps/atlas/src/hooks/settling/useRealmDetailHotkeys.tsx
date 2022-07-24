/* eslint-disable */

import { useEffect, useState } from 'react';
import useKeyPress from '../useKeyPress';

export const HotKeys = {
  Raid: 'r',
  Food: 'f',
  AttackingArmy: 'a',
  DefendingArmy: 'd',
  Buildings: 'b',
  Goblins: 'g',
  Survey: 's',
  Harvests: 'h',
  Lore: 'l',
  Vault: 'v',
};

export type Subview = keyof typeof HotKeys | null;

const useRealmDetailHotkeys = () => {
  const [subview, setSubview] = useState<Subview>(null);

  const raidPress = useKeyPress({ key: HotKeys.Raid});
  const foodPress = useKeyPress({ key: HotKeys.Food});
  const attackersPress = useKeyPress({ key: HotKeys.AttackingArmy});
  const defendersPress = useKeyPress({ key: HotKeys.DefendingArmy});
  const buildingsPress = useKeyPress({ key: HotKeys.Buildings});
  const goblinPress = useKeyPress({ key: HotKeys.Goblins});
  const statsPress = useKeyPress({ key: HotKeys.Survey});
  const harvestPress = useKeyPress({ key: HotKeys.Harvests});
  const lorePress = useKeyPress({ key: HotKeys.Lore});
  const vaultPress = useKeyPress({ key: HotKeys.Vault});

  useEffect(() => {
    if (raidPress) {
      subview == 'Raid' ? setSubview(null) : setSubview('Raid');
    }
    if (foodPress) {
      subview == 'Food' ? setSubview(null) : setSubview('Food');
    }
    if (attackersPress) {
      subview == 'AttackingArmy'
        ? setSubview(null)
        : setSubview('AttackingArmy');
    }
    if (defendersPress) {
      subview == 'DefendingArmy'
        ? setSubview(null)
        : setSubview('DefendingArmy');
    }
    if (buildingsPress) {
      subview == 'Buildings' ? setSubview(null) : setSubview('Buildings');
    }
    if (harvestPress) {
      subview == 'Harvests' ? setSubview(null) : setSubview('Harvests');
    }
    if (statsPress) {
      subview == 'Survey' ? setSubview(null) : setSubview('Survey');
    }
    if (goblinPress) {
      subview == 'Goblins' ? setSubview(null) : setSubview('Goblins');
    }
    if (lorePress) {
      subview == 'Lore' ? setSubview(null) : setSubview('Lore');
    }
    if(vaultPress) {
      subview == "Vault" ? setSubview(null) : setSubview("Vault")
    }
  }, [
    raidPress,
    foodPress,
    attackersPress,
    defendersPress,
    buildingsPress,
    goblinPress,
    statsPress,
    harvestPress,
    lorePress,
    vaultPress
  ]);

  return {
    subview,
    clear: () => setSubview(null),
    set: (val: Subview) => setSubview(val),
    raidPress,
    foodPress,
    attackersPress,
    defendersPress,
    buildingsPress,
    goblinPress,
    statsPress,
    harvestPress,
    lorePress,
    vaultPress
  };
};

export default useRealmDetailHotkeys;
