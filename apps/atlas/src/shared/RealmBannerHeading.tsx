import { Button, OrderIcon, ResourceIcon } from '@bibliotheca-dao/ui-lib';
interface HeaderProps {
  title: string;
  // icon: string;
  order: string;
}

export const RealmBannerHeading = (props: HeaderProps) => {
  return (
    <div className="flex flex-wrap p-4 text-gray-600 bg-orange-900 rounded shadow-lg">
      <div className="flex justify-between w-full text-2xl tracking-widest text-center text-white uppercase font-lords">
        <OrderIcon
          className="self-center"
          size={'sm'}
          order={props.order.toLowerCase()}
        />
        <div className="self-center text-4xl">~ {props.title} ~</div>
        <OrderIcon
          className="self-center stroke-white"
          size={'sm'}
          order={props.order.toLowerCase()}
        />
      </div>
    </div>
  );
};
