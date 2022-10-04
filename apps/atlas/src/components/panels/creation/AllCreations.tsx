import { useStarknet } from '@starknet-react/core';
import axios from 'axios';
import Image from 'next/image';

import { useMemo, useState } from 'react';
import {
  projectID,
  stableDiffusionEndPoints,
  stableDiffusionUrl,
} from '@/constants/character';
import type { ImageResponse } from '@/types/index';

export const AllCreations = () => {
  const { account } = useStarknet();
  const [rulers, setRulers] = useState<ImageResponse[]>();
  const [selectedRuler, setSelectedRuler] = useState<ImageResponse>();
  const [loading, setLoading] = useState(false);

  const fetchPlayers = async () => {
    setLoading(true);

    const params = {
      project: projectID,
      user: account,
    };
    const res = await axios.get(
      stableDiffusionUrl + stableDiffusionEndPoints.getImages,
      { params }
    );

    const obj: ImageResponse[] = res.data.map((a) => {
      return {
        img: a.uri,
        seed: a.generation_settings.seed,
        id: a.id,
        user: a.user,
      };
    });

    setRulers(obj);

    console.log(res);
    setLoading(false);
  };
  useMemo(() => {
    fetchPlayers();
  }, [account]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-8">
        <div className="p-10 ">
          <div className="grid grid-cols-8 gap-2">
            {rulers?.map((a, i) => {
              return (
                <Image
                  key={i}
                  width={200}
                  height={200}
                  layout={'responsive'}
                  className={'w-32 h-32 mx-auto rounded-full hover:opacity-50'}
                  src={a.img}
                  onClick={() => setSelectedRuler(a)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
