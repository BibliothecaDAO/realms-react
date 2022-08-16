import { Button } from '@bibliotheca-dao/ui-lib';
import { StringValueNode } from 'graphql';

interface Props {
  id: string;
  address: string;
  collection?: string;
}

export const MarketplaceByPanel = (props: Props) => {
  return (
    <div className="flex mt-4 space-x-2 rounded">
      {props.collection && (
        <Button
          className="w-full text-xs text-xl"
          target={'_blank'}
          size="xs"
          variant="primary"
          href={
            'https://www.loot.exchange/collections/' +
            props.collection +
            '/' +
            props.id
          }
          rel="noreferrer"
        >
          Loot Exchange
        </Button>
      )}

      <Button
        className="w-full text-xs text-xl"
        target={'_blank'}
        size="xs"
        variant="outline"
        href={'https://opensea.io/assets/' + props.address + '/' + props.id}
        rel="noreferrer"
      >
        Opensea
      </Button>
      <Button
        className="w-full text-xs text-xl"
        target={'_blank'}
        variant="outline"
        size="xs"
        href={
          'https://looksrare.org/collections/' + props.address + '/' + props.id
        }
        rel="noreferrer"
      >
        Looks rare
      </Button>
    </div>
  );
};
