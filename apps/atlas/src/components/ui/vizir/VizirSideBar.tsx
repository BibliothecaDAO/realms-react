import React, { useEffect } from 'react';
import { AppTypeEnum, LoginModal, Button } from 'web3-mq-react';
import AtlasSidebar from '@/components/map/AtlasSideBar';
import { sidebarClassNames } from '@/constants/ui';
import { BaseSideBarPanel } from '../sidebar/BaseSideBarPanel';
import VizirAsk from './VizirAsk';

interface ChatSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VizirSideBar = ({ isOpen, onClose }: ChatSideBarProps) => {
  return (
    <AtlasSidebar
      isOpen={isOpen}
      containerClassName={sidebarClassNames.replace('z-30', 'z-50')}
    >
      <BaseSideBarPanel position="right" onClose={onClose}>
        <VizirAsk />
      </BaseSideBarPanel>
    </AtlasSidebar>
  );
};
