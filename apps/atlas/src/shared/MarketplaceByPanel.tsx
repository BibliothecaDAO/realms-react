import { Button } from '@bibliotheca-dao/ui-lib';
import MintSquare from '@bibliotheca-dao/ui-lib/icons/marketplaces/mintSquare.svg';
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
          target={'_blank'}
          size="xs"
          className="w-full"
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

      {/* <Button
        target={'_blank'}
        size="xs"
        className="w-full"
        variant="outline"
        href={'https://opensea.io/assets/' + props.address + '/' + props.id}
        rel="noreferrer"
      >
        Opensea
      </Button>
      <Button
        target={'_blank'}
        variant="outline"
        size="xs"
        className="w-full"
        href={
          'https://looksrare.org/collections/' + props.address + '/' + props.id
        }
        rel="noreferrer"
      >
        Looks rare
      </Button> */}

      <Button
        target={'_blank'}
        size="xs"
        className="w-full"
        variant="outline"
        href={
          'https://mintsquare.io/asset/starknet-testnet/' +
          props.address +
          '/' +
          props.id
        }
        rel="noreferrer"
      >
        <MintSquare className="w-6 h-6 mr-4" />
        Mint Square
      </Button>
      <Button
        target={'_blank'}
        variant="outline"
        size="xs"
        className="w-full"
        href={
          'https://testnet.aspect.co/asset/' + props.address + '/' + props.id
        }
        rel="noreferrer"
      >
        {/* <MintSquare className="w-6 h-6 mr-4" /> */}
        Aspect
      </Button>
    </div>
  );
};
