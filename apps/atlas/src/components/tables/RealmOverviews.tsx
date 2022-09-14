import { Button } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';

import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';

import React, { createRef, useEffect, useRef, useState } from 'react';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import { RealmListCardView } from '../cards/realms/RealmListViewCard';

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

  const [tab, setTab] = useState(0);

  const cardRefs = useRef<any>([]);

  useEffect(() => {
    // add or remove refs
    cardRefs.current = Array(filteredRealms.length)
      .fill({})
      .map((_, i) => cardRefs.current[i] || createRef());
  }, [filteredRealms]);

  const tabs = [
    <Map key={0} className="self-center w-6 h-6 fill-current" />,
    <Castle key={1} className="self-center w-6 h-6 fill-current" />,
    <Helm key={2} className="self-center w-6 h-6 fill-current" />,
    <Sickle key={3} className="self-center w-6 h-6 fill-current" />,
  ];
  const tabNames = ['Overview', 'Resources', 'Military', 'Farming'];
  return (
    <div>
      <div className="flex justify-center w-full mt-4">
        Quick switch:
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
      <div className="grid grid-cols-12 gap-6 p-6 ">
        {props.realms &&
          filteredRealms.map((realm: RealmFragmentFragment, index) => (
            <RealmListCardView
              ref={(el) => (cardRefs.current[index] = el)}
              key={realm.realmId}
              realm={realm}
            />
          ))}
      </div>
    </div>
  );
}
