import clsx from 'clsx';
import React from 'react';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';

type ToolbarItemProps = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
  onClick: () => void;
};

const ToolbarItem = (props: ToolbarItemProps) => {
  return (
    <div>
      <button onClick={props.onClick} className="text-xs">
        {props.title}
      </button>{' '}
      {props.children}
    </div>
  );
};

type ToolbarProps = {
  className?: string;
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
        onClick={() => props.onSetSubview('Survey')}
        title="Survey"
      ></ToolbarItem>
      <ToolbarItem
        onClick={() => props.onSetSubview('Resources')}
        title="Resources"
      ></ToolbarItem>
      <ToolbarItem
        onClick={() => props.onSetSubview('Food')}
        title="Food"
      ></ToolbarItem>
      <ToolbarItem
        onClick={() => props.onSetSubview('Buildings')}
        title="Buildings"
      ></ToolbarItem>
      <ToolbarItem
        onClick={() => props.onSetSubview('Attack')}
        title="Attack"
      ></ToolbarItem>
      <ToolbarItem
        onClick={() => props.onSetSubview('Goblins')}
        title="Goblins"
      ></ToolbarItem>
      <ToolbarItem
        onClick={() => props.onSetSubview('Lore')}
        title="Lore"
      ></ToolbarItem>
      <ToolbarItem
        onClick={() => props.onSetSubview('History')}
        title="History"
      ></ToolbarItem>
    </div>
  );
};

export default RealmToolbar;
