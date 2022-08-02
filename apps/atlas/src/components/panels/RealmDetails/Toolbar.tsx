import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import { HotKeys } from '@/hooks/settling/useRealmDetailHotkeys';
import useKeyPress from '@/hooks/useKeyPress';
import usePrevious from '@/hooks/usePrevious';

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
  const pressed = useKeyPress({ key: props.hotkey });

  const prev = usePrevious(pressed);

  useEffect(() => {
    if (props.triggerOnPress && pressed && !prev) {
      props.onClick();
    }
  }, [pressed]);

  return (
    <div>
      <button
        onClick={props.onClick}
        className={`md:px-10 px-4 py-2 uppercase rounded-b-xl group font-display tracking-wider hover:bg-opacity-90 transition-all duration-300 hover:py-4 ${
          props.color
        }  ${props.selected ? 'bg-opacity-90 py-4  -mt-1' : 'bg-opacity-50'} `}
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
      hotkey: HotKeys.Army,
      click: () => props.onSetSubview('Army'),
      title: props.isOwnerOfRealm ? 'Army' : 'Attack',
      icon: <Helm className="w-5 h-5 fill-current stroke-current" />,
      tabName: 'Army',
    },
    {
      hotkey: HotKeys.Survey,
      click: () => props.onSetSubview('Survey'),
      title: 'Survey',
      icon: <Helm className="w-5 h-5 fill-current stroke-current" />,
      tabName: 'Survey',
    },
    {
      hotkey: HotKeys.Goblins,
      click: () => props.onSetSubview('Goblins'),
      title: 'Goblins',
      icon: <Helm className="w-5 h-5 fill-current stroke-current" />,
      tabName: 'Goblins',
    },
    {
      hotkey: HotKeys.History,
      click: () => props.onSetSubview('History'),
      title: 'History',
      icon: <Helm className="w-5 h-5 fill-current stroke-current" />,
      tabName: 'History',
    },
    {
      hotkey: HotKeys.Lore,
      click: () => props.onSetSubview('Lore'),
      title: 'Lore',
      icon: <Helm className="w-5 h-5 fill-current stroke-current" />,
      tabName: 'Lore',
    },
  ];

  return (
    <div className={clsx(props.className, 'w-full')}>
      <div
        className={clsx(
          'w-full flex space-x-1  md:space-x-4 md:pl-40 justify-center'
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
        {!props.isMobile && (
          <ToolbarItem
            color={props.color}
            selected={props.selected === 'PlayList'}
            hotkey="p"
            icon={<Helm className="w-5 h-5 fill-current stroke-current" />}
            triggerOnPress
            onClick={() => setShowPlaylist((prev) => !prev)}
            title="PlayList"
          />
        )}
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
