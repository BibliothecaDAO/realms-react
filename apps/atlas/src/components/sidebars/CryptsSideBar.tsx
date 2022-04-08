import { useQuery } from '@apollo/client';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import { getCryptQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import type { CryptData } from '@/types/index';
import { Crypt } from '../cards/Crypt';
import { BaseSideBar } from './BaseSideBar';
type Props = {
  id: string;
};

export const CryptsSideBar = (props: Props) => {
  const { toggleMenuType, selectedMenuType } = useUIContext();

  const { loading, error, data } = useQuery<CryptData>(getCryptQuery, {
    variables: { id: props.id.toString() },
  });

  return (
    <BaseSideBar open={selectedMenuType === 'crypt'}>
      <div className="top-0 bottom-0 right-0 z-20 w-full h-screen p-6 pt-10 overflow-auto lg:w-5/12 rounded-r-2xl">
        <div className="flex justify-end">
          <button
            className="right-0 z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70 shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.25)]"
            onClick={() => toggleMenuType('crypt')}
          >
            <Close />
          </button>
        </div>
        {data && data.dungeon && (
          <Crypt flyto={false} crypt={data!.dungeon} loading={loading} />
        )}
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Danger className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
      </div>
    </BaseSideBar>
  );
};
