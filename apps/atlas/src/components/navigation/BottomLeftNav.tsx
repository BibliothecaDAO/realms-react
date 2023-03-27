import { IconButton } from '@bibliotheca-dao/ui-lib';
import BottomLeftFrameGold from '@bibliotheca-dao/ui-lib/icons/frame/bottom-left_gold.svg';
import BottomLeftFrame from '@bibliotheca-dao/ui-lib/icons/frame/bottom-left_no-ink.svg';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { framePrimary, frameSecondary } from '@/constants/ui';
import { useSoundContext } from '@/context/soundProvider';
import { useUIContext } from '../../context/UIContext';
import NetworkConnectButton from '../ui/NetworkConnectButton';

export const BottomLeftNav = () => {
  const { toggleSound, isSoundActive } = useSoundContext();
  const { toggleAccountSettings } = useUIContext();
  const { toggleVizir } = useUIContext();

  return (
    <div className="absolute bottom-0 z-30">
      <div className="absolute  lg:bottom-[5.8rem] bottom-[4.1rem] left-[1.2rem] lg:left-6 ">
        <IconButton
          aria-label="Bank"
          variant="unstyled"
          texture={false}
          onClick={() => {
            toggleSound();
          }}
          icon={
            isSoundActive ? (
              <VolumeOn className="w-3 lg:w-5 stroke-primary-100 fill-frame-secondary" />
            ) : (
              <VolumeOff className="w-3 lg:w-5 stroke-primary-100 fill-frame-secondary" />
            )
          }
          size="md"
          className="jr-sound"
        />
      </div>
      <div className="relative">
        <div className="absolute w-12 h-12 lg:w-16 lg:h-16 bottom-2 left-2 lg:bottom-3 lg:left-3">
          <button onClick={() => toggleVizir()}>
            <img
              src={'/vizirs/mj_military_vizir.png'}
              alt="map"
              className="object-cover w-12 h-12 rounded-full lg:w-16 lg:h-16 lg:mb-4 lg:mr-4 hover:opacity-80 "
            />
          </button>
        </div>
        <div className="pl-16 lg:pl-[5rem] text-sm lg:text-lg relative z-10">
          <NetworkConnectButton />
        </div>
        <BottomLeftFrame
          className={`absolute bottom-0 pointer-events-none w-[13rem] lg:w-72  stroke-${framePrimary} fill-${framePrimary}`}
        />

        <BottomLeftFrameGold
          className={`absolute w-[10rem] lg:w-[14rem] pointer-events-none bottom-0 fill-frame-secondary fill-${frameSecondary} stroke-frame-secondary stroke-${frameSecondary}`}
        />

        <div
          className={`absolute bottom-0 left-0 w-[6.5px] lg:w-[8.8px] h-[calc(100vh-20rem)] lg:h-[calc(100vh-30rem)]  bg-${framePrimary} mb-40 lg:mb-72 pointer-events-none`}
        />
        <div
          className={`absolute bottom-0 left-2 lg:left-3 w-[1.5px] lg:w-[2px] h-[calc(100vh-20rem)] lg:h-[calc(100vh-32rem)] bg-${framePrimary} mb-40 lg:mb-72 pointer-events-none`}
        />
        <div
          className={`absolute bottom-0 left-[38.5px] lg:left-[53px] w-[1.5px] lg:w-[2.1px] h-[calc(100vh-20rem)] lg:h-[calc(100vh-30rem)] bg-${framePrimary} mb-40 lg:mb-72 pointer-events-none `}
        />
      </div>
    </div>
  );
};
