import { useQuery } from '@apollo/client';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { getGAQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import type { GAData } from '@/types/index';
import { LootData } from '@/types/index';
import { GAdventurer } from '../realms/GAdventurer';
import { BaseSideBar } from './BaseSideBar';

type Props = {
  id: number;
};

export const GASideBar = (props: Props) => {
  const { toggleGAMenu, GAMenu } = useUIContext();

  const { loading, error, data } = useQuery<GAData>(getGAQuery, {
    variables: { id: props.id.toString() },
  });

  return (
    <BaseSideBar open={GAMenu}>
      <div className="top-0 bottom-0 right-0 z-20 w-full h-screen p-6 pt-10 overflow-auto lg:w-5/12 rounded-r-2xl">
        <button
          className="z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={toggleGAMenu}
        >
          <Menu />
        </button>
        <h2 className="mt-8">Genesis Adventurer</h2>
        {data && data.gadventurer && (
          <GAdventurer flyto={false} ga={data!.gadventurer} loading={loading} />
        )}
      </div>
    </BaseSideBar>
  );
};