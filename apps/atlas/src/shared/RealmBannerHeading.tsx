import { OrderIcon } from '@bibliotheca-dao/ui-lib';
import { Combobox } from '@headlessui/react';
import { useState, Fragment } from 'react';
interface HeaderProps {
  title: string;
  // icon: string;
  realmId: number;
  order: string;
}

// const realms = [
//   { id: 1, name: 'smutmum' },
//   { id: 2, name: 'rektum' },
//   { id: 3, name: 'sdfascasdf' },
//   { id: 4, name: 'shoshoshun' },
// ];

export const RealmBannerHeading = (props: HeaderProps) => {
  const realms = [{ id: props.realmId, name: props.title }];
  const [selectedRealm, setSelectedRealm] = useState(realms[0]);
  const [query, setQuery] = useState('');

  const filteredRealms =
    query === ''
      ? realms
      : realms.filter((realm) => {
          return realm.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div
      className={`bg-opacity-90 flex flex-wrap px-8 p-4  rounded shadow-inner bg-order-${props.order.replace(
        'the ',
        ''
      )}`}
    >
      <div className="flex justify-between w-full text-2xl tracking-widest text-center uppercase font-lords">
        <OrderIcon
          className="self-center text-white stroke-white fill-white"
          size={'md'}
          order={props.order.toLowerCase()}
        />
        <div className="self-center">
          <Combobox value={selectedRealm} onChange={setSelectedRealm}>
            <Combobox.Input
              className={
                'rounded-md px-4 bg-transparent text-white text-3xl text-center'
              }
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(realm: any) => realm.name}
            />
            <Combobox.Options className="absolute z-10 py-1 mt-1 text-5xl bg-white rounded-md shadow-lg max-h-60 focus:outline-none sm:text-sm w-72">
              {filteredRealms.map((realm) => (
                <Combobox.Option key={realm.id} value={realm} as={Fragment}>
                  {({ active }) => (
                    <li
                      className={`${
                        active
                          ? 'bg-gray-500 text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      {/* {selected && <CheckIcon />} */}
                      {realm.name}
                    </li>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
            <Combobox.Button className="text-white">+</Combobox.Button>
          </Combobox>
        </div>

        {/* <div className="self-center text-4xl">~ {props.title} ~</div> */}
        <OrderIcon
          className="self-center text-white stroke-white fill-white"
          size={'md'}
          order={props.order.toLowerCase()}
        />
      </div>
    </div>
  );
};
