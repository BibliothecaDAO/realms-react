import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { useRealmContext } from '@/context/RealmContext';
import type {
  LoreEntityFragmentFragment,
  RealmFragmentFragment,
} from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { useWalletContext } from '@/hooks/useWalletContext';

interface LoreEntitiesProps {
  entity: LoreEntityFragmentFragment;
}

export function LoreEntityCard(props: LoreEntitiesProps) {
  const { setModal } = useAtlasContext();

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
      className={`px-4 py-3 rounded-md text-white cursor-pointer bg-black/95`}
      style={{
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
      }}
      role="button"
      onKeyUp={() => ({})}
      tabIndex={0}
      onClick={() => {
        setModal({
          type: 'lore-entity',
          props: { id: entity.id },
        });
      }}
    >
      <div className={`flex justify-between mb-3`}>
        <div className={`flex`}>
          <div className={`mr-2 border border-gray-700 px-2`}>#{entity.id}</div>
          {formatDate(entity.revisions[0]?.createdAt)}
        </div>
        <div>
          {entity.ownerDisplayName && (
            <div className={`flex justify-end`}>
              Author: {entity.ownerDisplayName}
            </div>
          )}
        </div>
      </div>

      <h1 className={`text-4xl`}>{entity.revisions[0]?.title}</h1>

      <div className="leading-tight">{entity.revisions[0]?.excerpt}</div>
    </div>
  );
}
