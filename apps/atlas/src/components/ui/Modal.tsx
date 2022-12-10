import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { animated } from '@react-spring/web';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useModalContext } from '@/context/ModalContext';
import type { TModal } from '@/hooks/useModal';
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
        realmFoodDetails={props.realmFoodDetails}
        availableFood={props.availableFood}
        buildingUtilisation={props.buildingUtilisation}
      />
    );
  }
};

export const Modals = () => {
  const { currentModal, closeModal } = useModalContext();
  const [isModalOpened, setIsModalOpened] = useState(false);

  useEffect(() => {
    if (currentModal) {
      setTimeout(() => {
        setIsModalOpened(true);
      }, 100);
    }
  }, [currentModal]);

  const close = () => {
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
        'absolute top-0 z-50 w-full h-full pb-20 bg-center bg-cover backdrop-filter backdrop-blur-md  transition-transform duration-300 ease-in-out',
        isModalOpened ? ' translate-y-0' : '-translate-y-full'
      )}
    >
      <div
        className={`h-full overflow-y-auto left-0 w-full mx-auto relative top-0 rounded bg-gray-1000 shadow-red-800/30 shadow-2xl border border-gray-700`}
      >
        <div className={`pt-4 px-4`}>
          <div className="flex justify-end">
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
          {component}
        </div>
      </div>
    </animated.div>
  );
};
