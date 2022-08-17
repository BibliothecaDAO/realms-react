/* eslint-disable */

import { useEffect, useState } from 'react';
import useKeyPress from '../useKeyPress';

export const HotKeys = {
  Army: 'a',
  Resources: 'r',
  History: 'h',
  Survey: 's',
  Lore: 'l',
};

export type Subview = keyof typeof HotKeys | null;

const useRealmDetailHotkeys = (initialSubview?:Subview) => {
  const [subview, setSubview] = useState<Subview>(initialSubview || null);

  const attackPress = useKeyPress({ key: HotKeys.Army});
  const historyPress = useKeyPress({ key: HotKeys.History });
  const surveyPress = useKeyPress({ key: HotKeys.Survey});
  const resourcesPress = useKeyPress({ key: HotKeys.Resources});
  const lorePress = useKeyPress({ key: HotKeys.Lore});

  useEffect(() => {
    if (attackPress) {
      subview == 'Army' ? setSubview(null) : setSubview('Army');
    }
    if (resourcesPress) {
      subview == 'Resources' ? setSubview(null) : setSubview('Resources');
    }
    if (surveyPress) {
      subview == 'Survey' ? setSubview(null) : setSubview('Survey');
    }
    if (lorePress) {
      subview == 'Lore' ? setSubview(null) : setSubview('Lore');
    }
    if(historyPress){
      subview == "History" ? setSubview(null) : setSubview("History");
    }
  }, [
    attackPress,
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
    surveyPress,
    resourcesPress,
    historyPress,
    lorePress,
  };
};

export default useRealmDetailHotkeys;
