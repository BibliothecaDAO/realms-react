import { Button } from '@bibliotheca-dao/ui-lib';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import { useState } from 'react';
import useScreenOrientation from '@/hooks/useScreenOrientation';

export const SplashScreen = ({ children }) => {
  const { toggleFullScreen, orientation } = useScreenOrientation();
  const [loading, setLoading] = useState(true);

  return !loading ? (
    children
  ) : (
    <div>
      <div className="flex left-0 justify-center items-center h-screen w-full bg-black bg-cover bg-realmBackground">
        <div className="relative flex flex-col lg:w-1/3 text-center">
          <Ouroboros className="self-center h-32 ml-2 mr-4 fill-yellow-600 " />
          <h1 className="mb-8">Eternum</h1>

          <div className="flex gap-4">
            <Button
              className="w-1/2"
              variant="primary"
              onClick={() => {
                setLoading(false);
              }}
            >
              Launch
            </Button>
            <Button
              className="w-1/2"
              variant="primary"
              onClick={() => {
                toggleFullScreen();
                setLoading(false);
              }}
            >
              Launch Fullscreen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
