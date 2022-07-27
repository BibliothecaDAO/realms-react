/* eslint-disable */

import { useEffect, useState } from 'react';
import useKeyPress from '../useKeyPress';

export const HotKeys = {
  Army: 'a',
  Resources: 'r',
  Food: 'f',
  History: 'h',
  Buildings: 'b',
  Goblins: 'g',
  Survey: 's',
  Lore: 'l',
};

export type Subview = keyof typeof HotKeys | null;

const useRealmDetailHotkeys = () => {
  const [subview, setSubview] = useState<Subview>(null);

  const attackPress = useKeyPress({ key: HotKeys.Army});
  const foodPress = useKeyPress({ key: HotKeys.Food});
  const buildingsPress = useKeyPress({ key: HotKeys.Buildings});
  const historyPress = useKeyPress({ key: HotKeys.History });
  const goblinPress = useKeyPress({ key: HotKeys.Goblins});
  const surveyPress = useKeyPress({ key: HotKeys.Survey});
  const resourcesPress = useKeyPress({ key: HotKeys.Resources});
  const lorePress = useKeyPress({ key: HotKeys.Lore});

  useEffect(() => {
    if (attackPress) {
      subview == 'Army' ? setSubview(null) : setSubview('Army');
    }
    if (foodPress) {
      subview == 'Food' ? setSubview(null) : setSubview('Food');
    }
    if (buildingsPress) {
      subview == 'Buildings' ? setSubview(null) : setSubview('Buildings');
    }
    if (resourcesPress) {
      subview == 'Resources' ? setSubview(null) : setSubview('Resources');
    }
    if (surveyPress) {
      subview == 'Survey' ? setSubview(null) : setSubview('Survey');
    }
    if (goblinPress) {
      subview == 'Goblins' ? setSubview(null) : setSubview('Goblins');
    }
    if (lorePress) {
      subview == 'Lore' ? setSubview(null) : setSubview('Lore');
    }
    if(historyPress){
      subview == "History" ? setSubview(null) : setSubview("History");
    }
  }, [
    attackPress,
    foodPress,
    buildingsPress,
    goblinPress,
    surveyPress,
    resourcesPress,
    historyPress,
    lorePress,
  ]);

  return {
    subview,
    clear: () => setSubview(null),
    set: (val: Subview) => setSubview(val),
    attackPress,
    foodPress,
    buildingsPress,
    goblinPress,
    surveyPress,
    resourcesPress,
    historyPress,
    lorePress,
  };
};

export default useRealmDetailHotkeys;
