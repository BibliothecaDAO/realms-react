import { useEffect, useState } from 'react';
import useKeyPress from '../useKeyPress';

const DefaultHotkeys = {
  Raid: 'r',
  Food: 'f',
  AttackingArmy: 'a',
  DefendingArmy: 'd',
  Buildings: 'b',
  Goblins: 'g',
  Statistics: 's',
  Harvests: 'h',
  Lore: 'l',
};

type Subview = keyof typeof DefaultHotkeys;

const useRealmDetailHotkeys = () => {
  const [subview, setSubview] = useState<Subview | null>(null);

  const raidPress = useKeyPress(DefaultHotkeys.Raid);
  const foodPress = useKeyPress(DefaultHotkeys.Food);
  const attackersPress = useKeyPress(DefaultHotkeys.AttackingArmy);
  const defendersPress = useKeyPress(DefaultHotkeys.DefendingArmy);
  const buildingsPress = useKeyPress(DefaultHotkeys.Buildings);
  const goblinPress = useKeyPress(DefaultHotkeys.Goblins);
  const statsPress = useKeyPress(DefaultHotkeys.Statistics);
  const harvestPress = useKeyPress(DefaultHotkeys.Harvests);
  const lorePress = useKeyPress(DefaultHotkeys.Lore);

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
      subview == 'Statistics' ? setSubview(null) : setSubview('Statistics');
    }
    if (goblinPress) {
      subview == 'Goblins' ? setSubview(null) : setSubview('Goblins');
    }
    if (lorePress) {
      subview == 'Lore' ? setSubview(null) : setSubview('Lore');
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
  ]);

  return {
    subview,
    clear: () => setSubview(null),
    set: (val: keyof typeof DefaultHotkeys | null) => setSubview(val),
  };
};

export default useRealmDetailHotkeys;
