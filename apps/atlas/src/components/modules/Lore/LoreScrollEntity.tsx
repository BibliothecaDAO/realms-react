import type {
  LoreEntityFragmentFragment,
  LorePoiFragmentFragment,
} from '@/generated/graphql';
import { useGetLorePoisQuery } from '@/generated/graphql';
import { LoreMarkdownRenderer } from './LoreMarkdownRenderer';

type LoreScrollEntityProps = {
  entity: LoreEntityFragmentFragment;
};

export const LoreScrollEntity = ({ entity }) => {
  const { data: pois, loading: poisLoading } = useGetLorePoisQuery();

  return (
    <div className={`p-6 my-4 mb-12 bg-black rounded-md`}>
      <h1 className={`text-6xl font-bold mb-6`}>{entity.revisions[0].title}</h1>

      {/* {JSON.stringify(loreEntity?.revisions[0])} */}

      <LoreMarkdownRenderer pois={pois} poisLoading={poisLoading}>
        {entity.revisions[0].markdown}
      </LoreMarkdownRenderer>
    </div>
  );
};
