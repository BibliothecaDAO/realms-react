import { Button } from '@bibliotheca-dao/ui-lib';
import { StringValueNode } from 'graphql';

interface Props {
  id: string;
  address: string;
  collection?: string;
}

export const MarketplaceByPanel = (props: Props) => {
  return (
    <div className="flex space-x-2 bg-black/20 p-2 rounded">
      {props.collection && (
        <Button
          className="text-xl w-full text-xs"
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
        className="text-xl w-full text-xs"
        target={'_blank'}
        size="xs"
        href={'https://opensea.io/assets/' + props.address + '/' + props.id}
        rel="noreferrer"
      >
        Opensea
      </Button>
      <Button
        className="text-xl w-full text-xs"
        target={'_blank'}
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
