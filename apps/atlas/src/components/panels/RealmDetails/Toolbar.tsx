import clsx from 'clsx';
import React from 'react';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import { HotKeys } from '@/hooks/settling/useRealmDetailHotkeys';
import useKeyPress from '@/hooks/useKeyPress';

type ToolbarItemProps = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
  hotkey: string;
  onClick: () => void;
};

const ToolbarItem = (props: ToolbarItemProps) => {
  const pressed = useKeyPress({ key: props.hotkey });

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
  onSetSubview: (string: Subview) => void;
};

const RealmToolbar: React.FC<ToolbarProps> = (props) => {
  return (
    <div
      className={clsx(
        props.className,
        'w-full flex justify-around bg-slate-700 p-4 gap-2'
      )}
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
    </div>
  );
};

export default RealmToolbar;
