import { useState } from 'react';
import useSound from 'use-sound';
import { useSoundContext } from '@/context/soundProvider';

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
  buildMilitary: 'buildings/military.mp3',
  buildCastle: 'buildings/castle.mp3',
  buildBarracks: 'buildings/barracks.mp3',
  buildArcherTower: 'buildings/archer_tower.mp3',
  buildMageTower: 'buildings/mage_tower.mp3',
  buildWorkHut: 'buildings/workhuts.mp3',
  buildFishingVillage: 'buildings/fishing_village.mp3',
  buildFarm: 'buildings/farm.mp3',
  buildStorehouse: 'buildings/storehouse.mp3',
  summonTroops: 'summonTroops.mp3',
  openSidebar: 'sidebar_in.mp3',
  closeSidebar: 'sidebar_out.mp3',
  addWheat: 'resources/wheat.mp3',
  addFish: 'resources/fish.mp3',
  addWood: 'resources/wood.mp3',
  addStone: 'resources/stone.mp3',
  addCoal: 'resources/coal.mp3',
  addCopper: 'resources/copper.mp3',
  addObsidian: 'resources/obsidian.mp3',
  addSilver: 'resources/silver.mp3',
  addIronwood: 'resources/ironwood.mp3',
  addColdIron: 'resources/cold_iron.mp3',
  addGold: 'resources/gold.mp3',
  addHartwood: 'resources/hartwood.mp3',
  addDiamonds: 'resources/diamonds.mp3',
  addTrueIce: 'resources/true_ice.mp3',
  addAlchemicalSilver: 'resources/alchemical_silver.mp3',
};

export const useUiSounds = (selector: string) => {
  const { effectsVolume } = useSoundContext();
  const [play, { stop }] = useSound(dir + selector, {
    volume: effectsVolume * 0.0025,
  });

  return {
    play,
  };
};
