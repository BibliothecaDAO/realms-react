import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import React, { createRef, useEffect, useRef, useState } from 'react';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import { RealmCard } from '../cards/realms/RealmCard';

interface RealmOverviewsProps {
  realms: RealmFragmentFragment[];
  isYourRealms?: boolean;
}

export function RealmOverviews(props: RealmOverviewsProps) {
  const { play } = useUiSounds(soundSelector.pageTurn);
  // Filtering out old realms
  const usedRealms = [897, 5455, 555, 7, 2];

  const filteredRealms = props.realms.filter(
    (item) => !usedRealms.includes(item.realmId)
  );

  const cardRefs = useRef<any>([]);

  useEffect(() => {
    // add or remove refs
    cardRefs.current = Array(filteredRealms.length)
      .fill({})
      .map((_, i) => cardRefs.current[i] || createRef());
  }, [filteredRealms]);

  const tabs = [
    <Castle key={2} className="self-center w-6 h-6 fill-current" />,
    <Sickle key={1} className="self-center w-6 h-6 fill-current" />,
    <Globe key={0} className="self-center w-6 h-6 fill-current" />,
  ];
  const tabNames = ['Overview', 'Resources', 'Military', 'Farming'];
  return (
    <div>
      <div className="flex justify-center w-full mt-4">
        {tabs.map((tab, index) => (
          <Tooltip
            key={index}
            placement="top"
            className="ml-3 text-xs"
            tooltipText={<span className="text-sm">{tabNames[index]}</span>}
          >
            <button
              className="ml-4"
              onClick={() => {
                play();
                cardRefs.current?.forEach((el) => {
                  el.selectTab(index);
                });
              }}
            >
              {tab}
            </button>
          </Tooltip>
        ))}
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-3 ">
        {props.realms &&
          filteredRealms.map((realm: RealmFragmentFragment, index) => (
            <RealmCard
              loading={false}
              ref={(el) => (cardRefs.current[index] = el)}
              key={realm.realmId}
              realm={realm}
            />
          ))}
      </div>
    </div>
  );
}
