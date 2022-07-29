import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
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
        className="text-xs group text-gray-300 hover:text-white"
      >
        <span
          className={clsx(
            'px-1 transition-colors py-0.5 group-hover:bg-white group-hover:text-black uppercase border',
            pressed && 'bg-white text-black'
          )}
        >
          {props.hotkey}
        </span>{' '}
        {props.title}
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
};

const RealmToolbar: React.FC<ToolbarProps> = (props) => {
  const [showPlaylist, setShowPlaylist] = useState(props.isMobile);

  return (
    <div className={clsx(props.className, 'w-full')}>
      <div
        className={clsx('w-full flex justify-around bg-slate-700 py-2 gap-2')}
      >
        <ToolbarItem
          hotkey={HotKeys.Army}
          onClick={() => props.onSetSubview('Army')}
          title={props.isOwnerOfRealm ? 'Army' : 'Attack'}
        ></ToolbarItem>
        <ToolbarItem
          hotkey={HotKeys.Survey}
          onClick={() => props.onSetSubview('Survey')}
          title="Survey"
        ></ToolbarItem>
        <ToolbarItem
          hotkey={HotKeys.Resources}
          onClick={() => props.onSetSubview('Resources')}
          title="Resources"
        ></ToolbarItem>
        <ToolbarItem
          hotkey={HotKeys.Food}
          onClick={() => props.onSetSubview('Food')}
          title="Food"
        ></ToolbarItem>
        <ToolbarItem
          hotkey={HotKeys.Buildings}
          onClick={() => props.onSetSubview('Buildings')}
          title="Buildings"
        ></ToolbarItem>

        <ToolbarItem
          hotkey={HotKeys.Goblins}
          onClick={() => props.onSetSubview('Goblins')}
          title="Goblins"
        ></ToolbarItem>
        <ToolbarItem
          hotkey={HotKeys.History}
          onClick={() => props.onSetSubview('History')}
          title="History"
        ></ToolbarItem>
        <ToolbarItem
          hotkey={HotKeys.Lore}
          onClick={() => props.onSetSubview('Lore')}
          title="Lore"
        ></ToolbarItem>
        {!props.isMobile && (
          <ToolbarItem
            hotkey="p"
            triggerOnPress
            onClick={() => setShowPlaylist((prev) => !prev)}
            title="PlayList"
          />
        )}
      </div>
      {showPlaylist && (
        <div className="w-full bg-slate-700 border-t border-t-slate-500 fill-white flex">
          <button onClick={() => props.onNavigateIntent('previous')}>
            <ChevronLeftIcon className="w-6 p-1 inline-block" />
            Prev{' '}
          </button>
          <div className="flex-1 text-center">All Realms</div>
          <button onClick={() => props.onNavigateIntent('next')}>
            Next
            <ChevronRightIcon className="w-6 p-1 inline-block" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RealmToolbar;
