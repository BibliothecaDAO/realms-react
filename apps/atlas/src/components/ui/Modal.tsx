import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { animated } from '@react-spring/web';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useModalContext } from '@/context/ModalContext';
import type { TModal } from '@/hooks/useModal';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import { LoreEntityModal } from '../lore/LoreEntityModal';
import { RealmBuildModal } from '../realms/RealmBuildModal';

const getModalComponent = (currentModal: TModal) => {
  const props: any = currentModal?.props;

  if (currentModal?.type === 'lore-entity') {
    return <LoreEntityModal entityId={parseInt(props.id)} />;
  }
  if (currentModal?.type === 'realm-build') {
    return (
      <RealmBuildModal
        realm={props.realm}
        buildings={props.buildings}
        availableFood={props.availableFood}
        buildingUtilisation={props.buildingUtilisation}
        prev={props.prev}
        next={props.next}
      />
    );
  }
};

export const Modals = () => {
  const { currentModal, closeModal } = useModalContext();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { play: playOpenSidebar } = useUiSounds(soundSelector.openSidebar);
  const { play: playCloseSidebar } = useUiSounds(soundSelector.closeSidebar);

  useEffect(() => {
    if (currentModal) {
      setTimeout(() => {
        playOpenSidebar();
        setIsModalOpened(true);
      }, 100);
    }
  }, [currentModal]);

  const close = () => {
    playCloseSidebar();
    setIsModalOpened(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  if (!currentModal) {
    return null;
  }

  const component = getModalComponent(currentModal);

  return (
    <animated.div
      className={clsx(
        'absolute top-0 z-50 w-full h-screen overflow-auto bg-center bg-cover backdrop-filter  bg-gray-1000 backdrop-blur-md  transition-transform duration-300 ease-in-out',
        isModalOpened ? ' translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="sticky z-10 flex justify-end mr-8 top-8 right-8">
        <div className="flex justify-end mb-2 mr-1">
          <Button
            size="xs"
            variant="outline"
            className="rounded-full"
            onClick={close}
          >
            <Close />
          </Button>
        </div>
      </div>
      <div
        className={`overflow-y-auto left-0 w-full mx-auto relative top-0 p-16`}
      >
        <div className={`h-full`}>{component}</div>
      </div>
    </animated.div>
  );
};
