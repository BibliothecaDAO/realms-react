import useSound from 'use-sound';

export const soundSelector = {
  claim: '/music/ui/Mint.mp3',
  sign: '/music/ui/SignFor2Command2.mp3',
  exportWheat: '/music/ui/ExportWheat4.mp3',
  harvestFish: '/music/ui/HarvestFish2.mp3',
  harvestWheat: '/music/ui/HarvestWheat4.mp3',
  raid: '/music/ui/KatanaEvent_1.mp3',
};

export const useUiSounds = (selector: string) => {
  const [play, { stop }] = useSound(selector, {
    volume: 0.2,
  });

  return {
    play,
  };
};
