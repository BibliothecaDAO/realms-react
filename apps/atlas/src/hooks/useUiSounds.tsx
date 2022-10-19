import useSound from 'use-sound';

const dir = '/music/ui/';

export const soundSelector = {
  claim: 'Mint.mp3',
  sign: 'SignFor2Command2.mp3',
  exportWheat: 'ExportWheat4.mp3',
  harvestFish: 'HarvestFish2.mp3',
  harvestWheat: 'HarvestWheat4.mp3',
  raid: 'KatanaEvent_1.mp3',
  pageTurn: 'ASO_foley_click_04.mp3',
  fly: 'whoosh_low_1.mp3',
  buildMilitary: 'RealmsUI_Castle5.mp3',
  buildWorkHut: 'Realms_Work_UI_2.mp3',
};

export const useUiSounds = (selector: string) => {
  const [play, { stop }] = useSound(dir + selector, {
    volume: 0.2,
  });

  return {
    play,
  };
};
