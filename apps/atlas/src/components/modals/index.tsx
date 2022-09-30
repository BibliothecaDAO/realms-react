import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { animated, useSpring } from '@react-spring/web';
import { useModalContext } from '@/context/ModalContext';
import type { TModal } from '@/hooks/useModal';
import { HelpModal } from './HelpModal';
import { LoreEntityModal } from './LoreEntityModal';

const getModalComponent = (currentModal: TModal) => {
  if (currentModal?.type === 'lore-entity') {
    const props: any = currentModal?.props;
    return <LoreEntityModal entityId={parseInt(props.id)} />;
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
    backdropFilter: currentModal ? `blur(4px)` : `blur(0px)`,
    delay: 150,
  });

  if (!currentModal) {
    return null;
  }

  const component = getModalComponent(currentModal);

  return (
    <animated.div
      className="absolute top-0 z-40 w-full h-full bg-center bg-cover"
      style={animation}
    >
      <div
        className={`h-full overflow-y-auto left-0 w-full lg:w-7/12 relative top-0`}
      >
        <div className={`pt-4 px-4`}>
          <div className="flex justify-end">
            <div className="flex justify-end mb-2 mr-1">
              <Button
                size="sm"
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
