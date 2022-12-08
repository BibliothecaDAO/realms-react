import { Button } from '@bibliotheca-dao/ui-lib';
import { ButtonOrLink } from '@bibliotheca-dao/ui-lib/base/button';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MainLayout } from '@/components/layout/MainLayout';

const Jobs = () => {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState<string[]>([]);
  useEffect(() => {
    Promise.all([fetch(`/${id}.md`)])
      .then((results) => Promise.all(results.map((result) => result.text())))
      .then((text) => setContent(text));
  }, []);

  return (
    <MainLayout>
      <div className="px-8 py-20 bg-black">
        <div className="container mx-auto">
          <div className="sm:w-1/2">
            <ReactMarkdown>{content[0]}</ReactMarkdown>
          </div>
          <div className="w-full mt-20">
            <Button
              aria-hidden="true"
              onClick={() => router.push(`/`)}
              size="lg"
              variant="primary"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Jobs;
