import { Button } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { LoreScrollEntity } from '@/components/panels/LoreComponents/LoreScrollEntity';
import { useGetLoreEntityQuery } from '@/generated/graphql';

export const LoreEntityModal = ({ entityId }) => {
  const { data, loading } = useGetLoreEntityQuery({
    variables: {
      id: entityId,
    },
  });

  const loreEntity = data?.getLoreEntity;

  return (
    <div className={``}>
      {loreEntity && (
        <div className={`-mt-12 mb-1`}>
          <button
            className={`bg-blue-600 px-4 py-2 text-lg rounded-lg font-semibold hover:bg-blue-800 transition-all outline-none shadow-md upper`}
            onClick={() => {
              const params = Object.entries({
                url: `${
                  window.location.origin
                }/lore/${entityId}-${loreEntity?.revisions[0].title
                  ?.toLowerCase()
                  .replace(/\s/g, '-')}`,
                text: 'New Loot Realms Lore:',
              })
                .filter(([, value]) => value !== undefined && value !== null)
                .map(
                  ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                      String(value)
                    )}`
                );

              window.open(
                `https://twitter.com/share?${params.join('&')}`,
                'sharer',
                'toolbar=0,status=0,width=550,height=400'
              );
            }}
          >
            Share on Twitter
          </button>
          {/* <button
            className={`bg-blue-600 px-4 py-2 text-lg rounded-lg font-semibold hover:bg-blue-800 transition-all outline-none shadow-md upper`}
            onClick={() => {
              const url = `${
                window.location.origin
              }/lore/${entityId}-${loreEntity?.revisions[0].title
                ?.toLowerCase()
                .replace(/\s/g, '-')}`;
            }}
          >
            Copy link for sharing
          </button> */}
        </div>
      )}

      <div className="bg-black/90 w-full rounded-md">
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Castle className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}

        {loreEntity && (
          <div
            className={
              'p-4 text-xl prose prose-stone prose-sm brightness-200 mt-2'
            }
          >
            <LoreScrollEntity entity={loreEntity} />
          </div>
        )}
      </div>
    </div>
  );
};
