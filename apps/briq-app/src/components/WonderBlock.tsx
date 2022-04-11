import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import type { Wonder } from '@/data/Orders';

export const WonderBlock = (props: Wonder) => {
  return (
    <div className="flex flex-col border rounded-2xl border-yellow-200 p-2 sm:p-6 text-center">
      <OrderIcon className="mx-auto" order={props.order} size="lg" />
      <h4>Order of {props.order}</h4>
      <h2>{props.name}</h2>
      <div className="flex space-x-2 pt-6 justify-around w-full mt-auto">
        <Button
          href={
            'https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
            props.id
          }
          className="w-full"
          variant="primary"
          size="xs"
        >
          opensea
        </Button>
        <Button
          href={'https://atlas.bibliothecadao.xyz/?realm=' + props.id}
          className="w-full"
          variant="primary"
          size="xs"
        >
          atlas
        </Button>
      </div>
    </div>
  );
};
