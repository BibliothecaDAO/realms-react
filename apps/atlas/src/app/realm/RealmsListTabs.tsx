'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import type { ReactElement } from 'react';
import React from 'react';
import { TabNavItem } from 'app/components/ui/TabNavItem';

// import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';

type RealmsListTabsProps = {
  className?: string;
  // onNavigateIntent: (direction: 'previous' | 'next') => void;
  // isMobile: boolean;
};

const RealmsListTabs: React.FC<RealmsListTabsProps> = (props) => {
  // const [showPlaylist, setShowPlaylist] = useState(props.isMobile);
  const [selectedLayoutSegments] = useSelectedLayoutSegments();

  const toolBarItems = [
    {
      title: 'Your Realms',
      tabName: 'your',
    },
    {
      title: 'Favourite Realms',
      tabName: 'favourite',
    },
  ];

  return (
    <div className={clsx(props.className, 'w-full')}>
      <div className={clsx('flex space-x-1  md:space-x-4 ')}>
        <TabNavItem href={`/realm`} isActive={!selectedLayoutSegments}>
          All Realms
        </TabNavItem>
        {toolBarItems.map((a, i) => {
          return (
            <TabNavItem
              key={i}
              href={`/realm/${a.tabName}`}
              isActive={a.tabName == selectedLayoutSegments}
            >
              {a.title}
            </TabNavItem>
          );
        })}
      </div>
    </div>
  );
};

export default RealmsListTabs;
