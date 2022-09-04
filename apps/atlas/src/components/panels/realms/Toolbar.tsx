import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import { HotKeys } from '@/hooks/settling/useRealmDetailHotkeys';
import useKeyPress from '@/hooks/useKeyPress';
import usePrevious from '@/hooks/usePrevious';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { Scroll } from '@/shared/Icons';

type ToolbarItemProps = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
  hotkey: string;
  onClick: () => void;
  triggerOnPress?: boolean;
  color: string;
  selected: boolean;
  icon: ReactElement;
};

const ToolbarItem = (props: ToolbarItemProps) => {
  const { play } = useUiSounds(soundSelector.pageTurn);

  const pressed = useKeyPress({ key: props.hotkey });

  const prev = usePrevious(pressed);

  useEffect(() => {
    if (props.triggerOnPress && pressed && !prev) {
      props.onClick();
    }
  }, [pressed]);

  const pressedTab = () => {
    play();
    props.onClick();
  };
  return (
    <div>
      <button
        onClick={pressedTab}
        className={`md:px-6 px-4 py-3 uppercase rounded-b-xl group font-display tracking-wide hover:bg-opacity-90 transition-all duration-300 hover:py-5 shadow-xl ${
          props.color
        }  ${props.selected ? 'bg-opacity-95 py-5' : 'bg-opacity-70'} `}
      >
        <span className="flex">
          {' '}
          {props.icon}
          <span className="hidden ml-4 md:block">{props.title} </span>
          <span
            className={clsx(
              'px-1 transition-colors uppercase opacity-30 hidden md:block',
              pressed && 'bg-white text-black'
            )}
          >
            {props.hotkey}
          </span>{' '}
        </span>
      </button>{' '}
      {props.children}
    </div>
  );
};

type ToolbarProps = {
  className?: string;
  selected: string | null;
  isOwnerOfRealm?: boolean;
  onNavigateIntent: (direction: 'previous' | 'next') => void;
  onSetSubview: (string: Subview) => void;
  isMobile: boolean;
  color: string;
};

const RealmToolbar: React.FC<ToolbarProps> = (props) => {
  const [showPlaylist, setShowPlaylist] = useState(props.isMobile);

  const toolBarItems = [
    {
      hotkey: HotKeys.Survey,
      click: () => props.onSetSubview('Survey'),
      title: 'Overview',
      icon: <Castle className="self-center w-6 h-6 fill-current" />,
      tabName: 'Survey',
    },
    {
      hotkey: HotKeys.Army,
      click: () => props.onSetSubview('Army'),
      title: 'Military',
      icon: (
        <Helm className="self-center w-6 h-6 fill-current stroke-current" />
      ),
      tabName: 'Army',
    },

    {
      hotkey: HotKeys.Resources,
      click: () => props.onSetSubview('Resources'),
      title: 'Resources',
      icon: <Lords className="self-center w-6 h-6 fill-current" />,
      tabName: 'Resources',
    },
    {
      hotkey: HotKeys.Resources,
      click: () => props.onSetSubview('Food'),
      title: 'Farming',
      icon: <Sickle className="self-center w-6 h-6 fill-current" />,
      tabName: 'Food',
    },
    {
      hotkey: HotKeys.History,
      click: () => props.onSetSubview('History'),
      title: 'History',
      icon: (
        <Scroll className="self-center w-6 h-6 fill-current stroke-current" />
      ),
      tabName: 'History',
    },
    {
      hotkey: HotKeys.Lore,
      click: () => props.onSetSubview('Lore'),
      title: 'Lore',
      icon: (
        <Scroll className="self-center w-6 h-6 fill-current stroke-current" />
      ),
      tabName: 'Lore',
    },
  ];

  return (
    <div className={clsx(props.className, 'w-full')}>
      <div
        className={clsx(
          'w-full justify-center sm:justify-start flex space-x-1  md:space-x-4 md:pl-44 '
        )}
      >
        {toolBarItems.map((a, i) => {
          return (
            <ToolbarItem
              key={i}
              selected={props.selected === a.tabName}
              color={props.color}
              icon={a.icon}
              hotkey={a.hotkey}
              onClick={a.click}
              title={a.title}
            />
          );
        })}
        {/* {!props.isMobile && (
          <ToolbarItem
            color={props.color}
            selected={props.selected === 'PlayList'}
            hotkey="p"
            icon={<Helm className="w-5 h-5 fill-current stroke-current" />}
            triggerOnPress
            onClick={() => setShowPlaylist((prev) => !prev)}
            title="PlayList"
          />
        )} */}
      </div>
      {/* {showPlaylist && (
        <div className="flex w-full border-t bg-slate-700 border-t-slate-500 fill-white">
          <button onClick={() => props.onNavigateIntent('previous')}>
            <ChevronLeftIcon className="inline-block w-6 p-1" />
            Prev{' '}
          </button>
          <div className="flex-1 text-center">All Realms</div>
          <button onClick={() => props.onNavigateIntent('next')}>
            Next
            <ChevronRightIcon className="inline-block w-6 p-1" />
          </button>
        </div>
      )} */}
    </div>
  );
};

export default RealmToolbar;
