import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type Prop = {
  isOpen: boolean;
  toggle: () => void;
  children?: React.ReactNode;
};

const Modal: React.FC<Prop> = (props) => {
  const isOpen = props.isOpen;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-20 overflow-y-auto "
        open={isOpen}
        onClose={() => props.toggle()}
      >
        <div className="flex items-start justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500/75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform sm:align-middle sm:w-full">
              <Dialog.Title className={'hidden'}>Desiege Setup</Dialog.Title>
              {props.children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
