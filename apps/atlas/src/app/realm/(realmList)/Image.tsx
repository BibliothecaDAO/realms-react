import { Button, Menu } from '@bibliotheca-dao/ui-lib';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export const RealmImage = ({ id }) => {
  const menuItems = ['Render', 'Map'];
  const [imageView, setImageView] = useState(menuItems[0]);
  const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  const triplet = (e1: number, e2: number, e3: number) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63);

  const rgbDataURL = (r: number, g: number, b: number) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
      triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

  return (
    <div className="relative w-auto">
      <Menu className="!absolute z-10 !w-auto right-1 top-1">
        <Menu.Button
          variant="outline"
          className={clsx(imageView === '3D' && 'text-red-600/60')}
          size="xs"
        >
          View
        </Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="right-0 w-48 bg-black border border-cta-100/60">
            <Menu.Group className="flex">
              {menuItems.map((menuItem) => {
                return (
                  <Menu.Item key={menuItem}>
                    {({ active }) => (
                      <Button
                        variant="unstyled"
                        size="xs"
                        className={clsx(
                          'block flex-1 font-display',
                          active ? 'text-red-900' : 'text-gray-500',
                          imageView === menuItem && 'text-red-500/60'
                        )}
                        fullWidth
                        onClick={() => setImageView(menuItem)}
                      >
                        {menuItem}
                      </Button>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu.Group>
          </Menu.Items>
        </Transition>
      </Menu>
      {imageView === 'Render' && (
        <Image
          src={`https://realms-assets.s3.eu-west-3.amazonaws.com/renders/${id}.webp`}
          alt="map"
          className="w-full mt-4 rounded-xl -scale-x-100"
          width={500}
          placeholder="blur"
          blurDataURL={rgbDataURL(20, 20, 20)}
          height={320}
          loading="lazy"
          layout={'responsive'}
        />
      )}
      {imageView === 'Map' && (
        <Image
          src={`https://d23fdhqc1jb9no.cloudfront.net/_Realms/${id}.svg`}
          alt="map"
          className="w-full mt-4 rounded-xl"
          width={350}
          placeholder="blur"
          blurDataURL={rgbDataURL(20, 20, 20)}
          height={350}
          loading="lazy"
          layout={'responsive'}
        />
      )}
    </div>
  );
};
