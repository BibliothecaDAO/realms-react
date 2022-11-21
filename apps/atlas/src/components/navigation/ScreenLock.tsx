/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from '@bibliotheca-dao/ui-lib';
import useScreenOrientation from '@/hooks/useScreenOrientation';

export const ScreenLock = () => {
  const { lockOrientation, orientation } = useScreenOrientation();

  return (
    <div className="absolute z-50 right-1/2 top-1/2">
      <div className="relative">
        Orientation: {orientation}
        <Button onClick={lockOrientation}>Lock Screen</Button>
      </div>
    </div>
  );
};
