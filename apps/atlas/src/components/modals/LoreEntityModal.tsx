import { Button } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import toast from 'react-hot-toast';
import { LoreScrollEntity } from '@/components/panels/LoreComponents/LoreScrollEntity';
import { useGetLoreEntityQuery } from '@/generated/graphql';

export const LoreEntityModal = ({ entityId }) => {
  const { data, loading } = useGetLoreEntityQuery({
    variables: {
      id: entityId,
    },
  });

  const loreEntity = data?.getLoreEntity;

  const getShareUrl = () => {
    return `${
      window.location.origin
    }/lore/${entityId}-${loreEntity?.revisions[0].title
      ?.toLowerCase()
      .replace(/\s/g, '-')
      .replace('.', '')}`;
  };

  const getTwitterParams = () => {
    const params = Object.entries({
      url: getShareUrl(),
      text: 'New @lootrealms Lore:',
    })
      .filter(([, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      );

    return params.join('&');
  };

  return (
    <div className={``}>
      {loreEntity && (
        <div className={`-mt-12 mb-1`}>
          <Button
            href="/lore"
            size="lg"
            className="bg-blue-600"
            variant={'primary'}
            onClick={() => {
              window.open(
                `https://twitter.com/share?${getTwitterParams()}`,
                'sharer',
                'toolbar=0,status=0,width=550,height=400'
              );
            }}
          >
            Share on Twitter
          </Button>
          <Button
            size="lg"
            className="bg-gray-800 ml-2"
            variant={'primary'}
            onClick={() => {
              navigator.clipboard.writeText(getShareUrl());

              toast(`Link is copied to clipboard`, {
                position: 'top-right',
                style: {
                  borderRadius: '2px',
                  background: '#000',
                  color: '#fff',
                },
              });
            }}
          >
            Copy link for sharing
          </Button>
        </div>
      )}

      <div className="bg-black/90 w-full rounded-md">
        {loading && (
          <div className="flex flex-col items-center gap-2 mx-auto animate-pulse py-8">
            <Castle className="block w-20 fill-current" />
            <h2>Loading Lore...</h2>
          </div>
        )}

        {loreEntity && (
          <div
            className={
              'p-4 text-xl prose prose-stone prose-sm brightness-200 mt-2 mb-2'
            }
          >
            <LoreScrollEntity entity={loreEntity} />
          </div>
        )}
      </div>
    </div>
  );
};
