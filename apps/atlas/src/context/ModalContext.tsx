import { createContext, useContext } from 'react';
import type { TModalContext } from '@/hooks/useModal';
import { useModal } from '@/hooks/useModal';

const ModalContext = createContext<TModalContext | undefined>(undefined);

export function useModalContext(): TModalContext {
  return useContext(ModalContext) as TModalContext;
}

export const ModalProvider = (props: { children: React.ReactNode }) => {
  const modalContext = useModal();
  return (
    <ModalContext.Provider value={modalContext}>
      {props.children}
    </ModalContext.Provider>
  );
};
