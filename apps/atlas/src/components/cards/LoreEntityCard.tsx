import {
  Button,
  Card,
  CardBody,
  OrderIcon,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib';
import { useAtlasContext } from '@/context/AtlasContext';
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
    <Card
      className={``}
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
      <CardBody>
        <div
          className={`flex justify-between mb-3 uppercase text-white/80 font-display `}
        >
          <div className={`flex self-center`}>
            {formatDate(entity.revisions[0]?.createdAt)}
          </div>
          <div className="px-2 py-1 border rounded border-yellow-600/20">
            {entity.ownerDisplayName && (
              <div className={`flex justify-end `}>
                {entity.ownerDisplayName}
              </div>
            )}
          </div>
        </div>

        <h3 className={`mb-1`}>
          #{entity.id} | {entity.revisions[0]?.title}
        </h3>

        <div className="leading-loosest">{entity.revisions[0]?.excerpt}</div>
      </CardBody>
    </Card>
  );
}
