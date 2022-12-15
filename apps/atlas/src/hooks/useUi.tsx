import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAtlasContext } from '@/context/AtlasContext';
import type { AssetType } from '@/hooks/useAtlasMap';

export type UIContextType = {
  assetSidebar: AssetType | null;
  openAsset: (type: AssetType) => void;
  closeAsset: () => void;
  toggleEmpire: () => void;
  toggleTrade: () => void;
  toggleOnboarding: () => void;
  toggleTransactionCart: () => void;
  toggleChatSidebar: () => void;
  closeAll: () => void;
  empireSidebar: boolean;
  tradeSidebar: boolean;
  transactionCart: boolean;
  chatSidebar: boolean;
  onboarding: boolean;
};

export function useUi() {
  const { mapContext } = useAtlasContext();
  const selectedAsset = mapContext.selectedAsset;
  const router = useRouter();

  const [assetSidebar, setAssetSidebar] = useState<AssetType | null>(null);
  const [empireSidebar, setEmpireSidebar] = useState<boolean>(false);
  const [tradeSidebar, setTradeSidebar] = useState<boolean>(false);
  const [transactionCart, setTransactionCart] = useState<boolean>(false);
  const [chatSidebar, setChatSidebar] = useState<boolean>(false);

  const [onboarding, setOnboarding] = useState<boolean>(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (selectedAsset) {
      setAssetSidebar(selectedAsset.type);
      setEmpireSidebar(false);
    }
  }, [router.isReady, selectedAsset]);

  const openAsset = (type: AssetType) => {
    setEmpireSidebar(false);
    setAssetSidebar(type);
  };

  const closeAsset = () => {
    setAssetSidebar(null);
    router.push('/', undefined, { shallow: true });
  };

  const toggleEmpire = () => {
    router.push('/', undefined, { shallow: true });
    closeAll();
    setEmpireSidebar(!empireSidebar);
  };

  const toggleTrade = () => {
    setTradeSidebar(!tradeSidebar);
  };

  const toggleTransactionCart = () => {
    setTransactionCart(!transactionCart);
  };

  const toggleChatSidebar = () => {
    setChatSidebar(!chatSidebar);
  };

  const toggleOnboarding = () => {
    setOnboarding(!onboarding);
  };

  const closeAll = () => {
    setEmpireSidebar(false);
    setTradeSidebar(false);
    setTransactionCart(false);
    setOnboarding(false);
    setAssetSidebar(null);
  };

  return {
    openAsset,
    closeAsset,
    assetSidebar,
    empireSidebar,
    toggleEmpire,
    tradeSidebar,
    toggleTrade,
    transactionCart,
    toggleTransactionCart,
    chatSidebar,
    toggleChatSidebar,
    toggleOnboarding,
    onboarding,
    closeAll,
  };
}
