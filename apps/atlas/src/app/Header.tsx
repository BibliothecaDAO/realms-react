/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import Link from 'next/link';

export function Header() {
  return (
    <div className="top-0 left-0 z-40 justify-end hidden border-b-4 card border-white/20 bg-gray-1100/95 sm:flex bg-snake">
      <div className="flex justify-end w-full px-4 py-4 ml-auto mr-auto space-x-4">
        <div className="self-center mr-auto">
          <Link href={'/'}>
            <span className="flex">
              {' '}
              <Ouroboros className="self-center h-10 ml-2 mr-4 fill-yellow-600 " />
              <div className="self-center text-3xl font-lords">Eternum</div>
              {/* <BibliothecaDAO className="self-center h-5 ml-2 mr-auto stroke-white fill-white" /> */}
            </span>
          </Link>
        </div>
        {/* network here */}
      </div>
      {/* sidebars here */}
    </div>
  );
}
