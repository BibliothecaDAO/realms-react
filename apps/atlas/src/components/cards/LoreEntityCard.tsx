import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { useRealmContext } from '@/context/RealmContext';
import type {
  LoreEntityFragmentFragment,
  RealmFragmentFragment,
} from '@/generated/graphql';
import { useWalletContext } from '@/hooks/useWalletContext';

interface LoreEntitiesProps {
  entity: LoreEntityFragmentFragment;
}

export function LoreEntityCard(props: LoreEntitiesProps) {
  // const { setModal } = useAtlasContext();

  const { entity } = props;

  function formatDate(createdAt) {
    const date = new Date(createdAt);
    const d = date.getDate();
    const m = date.getMonth() + 1; // Month from 0 to 11
    const y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  return (
    <div
      className={`p-6 rounded-md border-white/30 cursor-pointer bg-black/95 border-4 border-double hover:bg-white/10 transition-all duration-300`}
      style={{
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
      }}
      role="button"
      onKeyUp={() => ({})}
      tabIndex={0}
      // onClick={() => {
      //   setModal({
      //     type: 'lore-entity',
      //     props: { id: entity.id },
      //   });
      // }}
    >
      <h2 className={`mb-1`}>{entity.revisions[0]?.title}</h2>
      <div className={`flex justify-between mb-3 uppercase text-white/40`}>
        <div className={`flex`}>
          <div className={`mr-2  border-white/30`}>#{entity.id}</div>
          {formatDate(entity.revisions[0]?.createdAt)}
        </div>
        <div>
          {entity.ownerDisplayName && (
            <div className={`flex justify-end tracking-widest`}>
              Author: {entity.ownerDisplayName}
            </div>
          )}
        </div>
      </div>
      <div className="leading-loosest">{entity.revisions[0]?.excerpt}</div>
    </div>
  );
}
