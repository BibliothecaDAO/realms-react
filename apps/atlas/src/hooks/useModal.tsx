import { useState } from 'react';

type ModalTypes = 'lore-entity';

export type TModalContext = {
  openModal: any;
  closeModal: any;
  currentModal: any;
};

export type TModal = {
  type: ModalTypes;
  props?: object;
} | null;

export function useModal() {
  const [currentModal, setCurrentModal] = useState<TModal>(null);

  const openModal = (type: ModalTypes, props: object = {}) => {
    setCurrentModal({ type, props });
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  return { currentModal, openModal, closeModal };
}
