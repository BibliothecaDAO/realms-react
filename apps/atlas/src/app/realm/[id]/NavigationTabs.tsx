import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import clsx from 'clsx';
import Link from 'next/link';
import type { ReactElement } from 'react';
import React from 'react';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import { HotKeys } from '@/hooks/settling/useRealmDetailHotkeys';
import useKeyPress from '@/hooks/useKeyPress';
import usePrevious from '@/hooks/usePrevious';
// import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { Scroll } from '@/shared/Icons';

type ToolbarItemProps = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
  hotkey: string;
  triggerOnPress?: boolean;
  color?: string;
  selected: boolean;
  icon: ReactElement;
};

const ToolbarItem = (props: ToolbarItemProps) => {
  /* const { play } = useUiSounds(soundSelector.pageTurn);

  const pressed = useKeyPress({ key: props.hotkey });

  const prev = usePrevious(pressed);

   useEffect(() => {
    if (props.triggerOnPress && pressed && !prev) {
      props.onClick();
    } 
  }, [pressed]); */

  /* const pressedTab = () => {
    play();
    props.onClick();
  }; */
  return (
    <div>
      <button
        className={`md:px-6 px-4 py-3 uppercase rounded-b-xl group font-display tracking-wide hover:bg-opacity-90 transition-all duration-300 hover:py-5 shadow-xl card border paper ${
          props.color
        }  ${props.selected ? 'bg-opacity-95 py-5' : 'bg-opacity-70'} `}
      >
        <span className="flex">
          {' '}
          {props.icon}
          <span className="hidden ml-4 xl:block">{props.title} </span>
          <span
            className={clsx(
              'px-1 transition-colors uppercase opacity-30 hidden xl:block',
              {
                /* pressed && 'bg-white text-black' */
              }
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

type NavigationTabsProps = {
  className?: string;
  // onNavigateIntent: (direction: 'previous' | 'next') => void;
  // isMobile: boolean;
  color?: string;
  realmId: number;
};

const NavigationTabs: React.FC<NavigationTabsProps> = (props) => {
  // const [showPlaylist, setShowPlaylist] = useState(props.isMobile);

  const toolBarItems = [
    {
      hotkey: HotKeys.Overview,
      title: 'Overview',
      icon: <Castle className="self-center w-6 h-6 fill-current" />,
      tabName: 'overview',
    },
    {
      hotkey: HotKeys.Army,
      title: 'Military',
      icon: (
        <Helm className="self-center w-6 h-6 fill-current stroke-current" />
      ),
      tabName: 'military',
    },

    {
      hotkey: HotKeys.Resources,
      title: 'Resources',
      icon: <Lords className="self-center w-6 h-6 fill-current" />,
      tabName: 'resources',
    },
    {
      hotkey: HotKeys.Resources,
      title: 'Farming',
      icon: <Sickle className="self-center w-6 h-6 fill-current" />,
      tabName: 'farming',
    },
    {
      hotkey: HotKeys.History,
      title: 'History',
      icon: (
        <Scroll className="self-center w-6 h-6 fill-current stroke-current" />
      ),
      tabName: 'history',
    },
    {
      hotkey: HotKeys.Lore,
      title: 'Lore',
      icon: (
        <Scroll className="self-center w-6 h-6 fill-current stroke-current" />
      ),
      tabName: 'lore',
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
            <Link key={i} href={`/realm/${props.realmId}/${a.tabName}`}>
              <ToolbarItem
                selected={'add page slug' === a.tabName}
                color={props.color}
                icon={a.icon}
                hotkey={a.hotkey}
                title={a.title}
              />
            </Link>
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

export default NavigationTabs;
