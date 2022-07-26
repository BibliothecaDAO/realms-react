import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { FaqBlock } from '@/components/Faqs';
import { FullPageSlides } from '@/components/FullPageSlides';
import { MainLayout } from '@/components/layout/MainLayout';
import { WithNavMenu } from '@/components/NavMenu';

function Home() {
  return (
    <MainLayout>
      <FullPageSlides />
      <div className="container px-8 py-5 mx-auto sm:w-1/2 sm:px-0 lg:w-1/4">
        <FaqBlock />
        <h1 className="text-xl font-semibold text-center lg:text-4xl">
          Stay up to Date
        </h1>
        <p className="px-10 py-1 text-center">
          Sign up to the newsletter and be the first one to know about new
          developments in the ecosystem.
        </p>
        <div className="flex justify-center mt-6">
          <div className="flex-row">
            <div className="bg-white rounded-lg">
              <div className="flex justify-between flex-warp md:flex-row">
                <input
                  type="email"
                  className="p-3 m-1 text-sm font-medium text-gray-700 border-none appearance-none md:w-96 focus:outline-none focus:border-white focus:rounded focus:placeholder-transparent"
                  placeholder="Enter your email"
                  aria-label="Enter your email"
                />
                <button className="w-full p-2 m-1 text-sm font-semibold bg-gray-800 rounded-lg lg:w-auto hover:bg-gray-700">
                  Subscribe
                </button>
              </div>
            </div>
            <p className="mt-2 ml-1 text-sm font-light text-gray-300">
              Unsubscribe at any time
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
