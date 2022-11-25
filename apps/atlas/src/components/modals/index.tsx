import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { animated, useSpring } from '@react-spring/web';
import { useModalContext } from '@/context/ModalContext';
import type { TModal } from '@/hooks/useModal';
import { HelpModal } from './HelpModal';
import { LoreEntityModal } from './LoreEntityModal';
import { RealmBuildModal } from './RealmBuildModal';

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
      />
    );
  }
  // switch (currentModal?.type) {
  //   case 'lore-entity':

  // case 'raid-result':
  //   component = (
  //     <RaidResultModal defendId={parseInt(props.defendId)} tx={props.tx} />
  //   );
  //   break;

  // case 'help':
  //   component = <HelpModal content={props.content} />;
  //   break;
  // }
  // if (selectedModal.type === 'raid-result' && props) {
  //   component = (
  //     <RaidResultModal defendId={parseInt(props.defendId)} tx={props.tx} />
  //   );
  // }
};

export const Modals = () => {
  const { currentModal, closeModal } = useModalContext();

  const animation = useSpring({
    opacity: currentModal ? 1 : 0,
    transform: currentModal ? `translateY(0)` : `translateY(-200%)`,
    backdropFilter: currentModal ? `blur(1px)` : `blur(0px)`,
    delay: 100,
  });

  if (!currentModal) {
    return null;
  }

  const component = getModalComponent(currentModal);

  return (
    <animated.div
      className="absolute top-0 z-40 w-full h-full bg-center bg-cover py-20"
      style={animation}
    >
      <div
        className={`h-full overflow-y-auto left-0 w-full lg:w-9/12 mx-auto relative top-0 rounded bg-gray-1000 shadow-red-800/30 shadow-2xl border border-gray-700`}
      >
        <div className={`pt-4 px-4`}>
          <div className="flex justify-end">
            <div className="flex justify-end mb-2 mr-1">
              <Button
                size="xs"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  closeModal();
                }}
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
