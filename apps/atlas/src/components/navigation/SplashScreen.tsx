import { Button } from '@bibliotheca-dao/ui-lib';
import { useState } from 'react';
import useScreenOrientation from '@/hooks/useScreenOrientation';

export const SplashScreen = ({ children }) => {
  const { lockOrientation, orientation } = useScreenOrientation();
  const [loading, setLoading] = useState(true);

  return !loading ? (
    children
  ) : (
    <div>
      <div className="flex left-0 justify-center items-center h-screen w-full bg-warRoom bg-cover">
        <div className="relative flex flex-col lg:w-1/3">
          Orientation: {orientation}
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
                lockOrientation();
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
