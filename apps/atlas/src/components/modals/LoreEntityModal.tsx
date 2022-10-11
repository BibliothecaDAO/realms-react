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
    <div className="w-full rounded-md">
      {loading && (
        <div className="flex flex-col items-center gap-2 py-8 mx-auto animate-pulse">
          <Castle className="block w-20 fill-current" />
          <h2>Loading Lore...</h2>
        </div>
      )}

      {loreEntity && (
        <div
          className={`w-full p-10 brightness-200 mt-2 mb-2 bg-black border-double border-white/30 border-4 rounded-xl`}
        >
          <div className={'text-xl prose prose-stone prose-sm '}>
            <LoreScrollEntity entity={loreEntity} />
          </div>
        </div>
      )}
      {loreEntity && (
        <div className={`mb-1 p-4`}>
          <Button
            href="/lore"
            size="xs"
            variant={'outline'}
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
            size="xs"
            className="ml-2"
            variant={'outline'}
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
    </div>
  );
};
