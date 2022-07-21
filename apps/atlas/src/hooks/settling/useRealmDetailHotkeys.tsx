import useKeyPress from '../useKeyPress';

const DefaultHotkeys = {
  Raid: 'R',
  Food: 'F',
  AttackingArmy: 'A',
  DefendingArmy: 'D',
  Buildings: 'B',
  Goblins: 'G',
  Statistics: 'S',
  Harvests: 'H',
  Lore: 'L',
  Military: 'M',
};

const useRealmDetailHotkeys = () => {
  const raidPress = useKeyPress(DefaultHotkeys.Raid);
  const foodPress = useKeyPress(DefaultHotkeys.Food);
  const attackersPress = useKeyPress(DefaultHotkeys.AttackingArmy);
  const defendersPress = useKeyPress(DefaultHotkeys.DefendingArmy);
  const buildingsPress = useKeyPress(DefaultHotkeys.Buildings);
  const goblinPress = useKeyPress(DefaultHotkeys.Goblins);
  const harvestPress = useKeyPress(DefaultHotkeys.Harvests);
};
